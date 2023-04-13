import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { League } from '../entities/league.entity';
import { Repository } from 'typeorm';
import { RiotAPIService } from '../../riot-api/riot.api.service';
import { Summoner } from '../../summoner/entities/summoner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLeagueDto, UpdateLeagueDto } from '../dto/league.dto';
import { mapLeagueToDto } from './league.service.utils';

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(League)
    private leagueRepository: Repository<League>,
    @InjectRepository(Summoner)
    private readonly summonerRepository: Repository<Summoner>,
    private readonly riotService: RiotAPIService,
  ) {}

  async create(region, createLeagueDto: CreateLeagueDto) {
    const summoner = await this.summonerRepository.findOne({
      select: ['id'],
      where: { id: createLeagueDto.summonerId },
    });

    if (!summoner) {
      throw new HttpException(
        `Summoner with id ${createLeagueDto.summonerId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const league = this.leagueRepository.create(createLeagueDto);
      league.summoner = summoner;
      league.region = region;
      this.leagueRepository.insert(league);
      return createLeagueDto;
    } catch (error) {
      throw new HttpException(
        `Error at creating League`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createMany(region: string, leagues: CreateLeagueDto[]) {
    const newLeagues: CreateLeagueDto[] = [];
    for (const league of leagues) {
      newLeagues.push({ ...league, region });
    }

    try {
      await this.leagueRepository.insert(newLeagues);
      return newLeagues;
    } catch (error) {
      throw new HttpException(
        `Error at creating Leagues`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(region: string) {
    return (
      await this.leagueRepository
        .createQueryBuilder('league')
        .innerJoin('league.summoner', 'summoner')
        .where('league.region = :region', { region })
        .getMany()
    ).map(mapLeagueToDto);
  }

  async findBySummonerName(region: string, summonerName: string) {
    const query = await this.leagueRepository
      .createQueryBuilder('league')
      .select(['league'])
      .innerJoin('league.summoner', 'summoner')
      .where('league.region = :region', { region })
      .andWhere('summoner.region = :region', { region })
      .andWhere('summoner.name = :summonerName', { summonerName });

    let leagues: CreateLeagueDto[] = (await query.getMany()).map(
      mapLeagueToDto,
    );
    if (leagues.length <= 1) {
      const summoner = await this.summonerRepository.findOne({
        where: { region, name: summonerName },
      });
      if (!summoner) {
        throw new HttpException(
          `Summoner with name ${summonerName} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      // Fetch league from Riot API
      const data: CreateLeagueDto[] =
        await this.riotService.fetchLeagueBySummonerId(region, summoner.id);
      // Save league to database
      leagues = await this.createMany(region, data);
    }
    return leagues;
  }

  async findBySummonerAndQueue(
    region: string,
    summonerName: string,
    queueType: string,
  ) {
    const query = await this.leagueRepository
      .createQueryBuilder('league')
      .select(['league'])
      .innerJoin('league.summoner', 'summoner')
      .where('league.region = :region', { region })
      .andWhere('league.queueType = :queueType', { queueType })
      .andWhere('summoner.region = :region', { region })
      .andWhere('summoner.name = :summonerName', { summonerName });

    let league: CreateLeagueDto = mapLeagueToDto(await query.getOne());
    if (!league) {
      league = (await this.findBySummonerName(region, summonerName)).find(
        (league) => league.queueType === queueType,
      );
    }
    return league;
  }

  update(region: string, leagueId: string, updateLeagueDto: UpdateLeagueDto) {
    return this.leagueRepository.update({ region, leagueId }, updateLeagueDto);
  }

  remove(region: string, leagueId: string) {
    return this.leagueRepository.delete({ region, leagueId });
  }
}
