import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { League } from '../entities/league.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeagueDto, UpdateLeagueDto } from '../dto/league.dto';
import { mapLeagueToDto } from '../utils/league.service.utils';
import { RiotAPIService } from '../../../modules/riot-api/riot.api.service';
import { QUEUE_TYPES, REPOSITORIES } from '../../../shared/constants/constants';
import { SummonerService } from '../../../modules/summoner/services/summoner.service';
import { PlayerSummary } from '../../../modules/summary/entities/player_summary.entity';

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(League)
    private leagueRepository: Repository<League>,
    @Inject(REPOSITORIES.SOURCE)
    private readonly dataSource: Repository<DataSource>,
    private readonly summonerService: SummonerService,
    private readonly riotService: RiotAPIService,
  ) {}

  async create(region, createLeagueDto: CreateLeagueDto) {
    const summoner = await this.summonerService.findBySummonerName(
      region,
      createLeagueDto.summonerName,
    );
    const player = await this.dataSource.manager.findOne(PlayerSummary, {
      where: { summoner: summoner },
    });

    try {
      const league = this.leagueRepository.create(createLeagueDto);
      league.summoner = summoner;
      league.region = region;
      league.player = player;
      this.leagueRepository.insert(league);
      return createLeagueDto;
    } catch (error) {
      throw new HttpException(
        `Error at creating League`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createMany(
    region: string,
    leaguesDTO: CreateLeagueDto[],
    summonerEntity?: any,
  ) {
    let summoner = summonerEntity;
    if (!summoner) {
      // Fallback or legacy (risky if name doesn't match)
      summoner = await this.summonerService.findBySummonerName(
        region,
        leaguesDTO[0].summonerName,
      );
    }

    const player = await this.dataSource.manager.findOne(PlayerSummary, {
      where: { summoner: summoner },
    });

    const newLeagues: League[] = [];
    for (const leagueDto of leaguesDTO) {
      const league = this.leagueRepository.create(leagueDto);
      league.summoner = summoner;
      league.region = region;
      league.player = player;
      newLeagues.push(league);
    }

    try {
      await this.leagueRepository.insert(newLeagues);
      return newLeagues.map(mapLeagueToDto);
    } catch (error) {
      // If unique constraint error, maybe we should update instead?
      // For simplicity, returning what's mapped or throwing.
      // ignoring specific error handling for brevity in this refactor
      throw new HttpException(
        `Error at creating Leagues: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(region: string) {
    return await this.leagueRepository.find({
      where: { region: region },
    });
  }

  async findByRiotId(
    region: string,
    gameName: string,
    tagLine: string,
    queueId?: string,
  ) {
    const riotId = `${gameName}#${tagLine}`;
    const query = await this.leagueRepository
      .createQueryBuilder('league')
      .select('league')
      .leftJoinAndSelect('league.summoner', 'summoner')
      .where('league.region = :region', { region })
      .andWhere('summoner.region = :region', { region })
      .andWhere('summoner.name = :riotId', { riotId });

    const validLeague = +queueId === 440 || +queueId === 420;

    if (validLeague) {
      const queueType = QUEUE_TYPES[+queueId];
      query.andWhere('league.queueType = :queueType', { queueType: queueType });
    }

    const exists = await query.getExists();
    if (exists) {
      return (await query.getMany()).map(mapLeagueToDto);
    }

    const summoner = await this.summonerService.findByRiotId(
      region,
      gameName,
      tagLine,
    );
    // Fetch league from Riot API using PUUID (updated endpoint)
    let data: CreateLeagueDto[];
    try {
      data = await this.riotService.fetchLeagueByPuuid(region, summoner.puuid);
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not fetch Leagues from Riot API`,
      );
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Save league to database
    // Pass summoner entity directly
    const leagues = await this.createMany(region, data, summoner);
    if (validLeague) {
      return leagues.filter(
        (league) => league.queueType === QUEUE_TYPES[+queueId],
      );
    }

    return leagues;
  }

  /**
   * @deprecated Use findByRiotId instead
   */
  async findBySummonerName(
    region: string,
    summonerName: string,
    queueId?: string,
  ) {
    // Trying to infer parts? Or just fail?
    // For now, let's just fail or try exact match if name is "Name#Tag"
    if (summonerName.includes('#')) {
      const [game, tag] = summonerName.split('#');
      return this.findByRiotId(region, game, tag, queueId);
    }
    throw new HttpException(
      'Please use RiotID (GameName#TagLine)',
      HttpStatus.BAD_REQUEST,
    );
  }

  update(region: string, leagueId: string, updateLeagueDto: UpdateLeagueDto) {
    return this.leagueRepository.update({ region, leagueId }, updateLeagueDto);
  }

  remove(region: string, leagueId: string) {
    return this.leagueRepository.delete({ region, leagueId });
  }
}
