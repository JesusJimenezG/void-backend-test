import { Injectable } from '@nestjs/common';
import { CreateLeagueDto } from '../dto/create-league.dto';
import { League } from '../entities/league.entity';
import { Repository } from 'typeorm';
import { RiotAPIService } from '../../riot-api/riot.api.service';
import { Summoner } from '../../summoner/entities/summoner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateLeagueDto } from '../dto/update-league.dto';

@Injectable()
export class LeagueService {
  constructor(
    @InjectRepository(League)
    private leagueRepository: Repository<League>,
    @InjectRepository(Summoner)
    private summonerRepository: Repository<Summoner>,
    private readonly riotService: RiotAPIService,
  ) {}

  async create(createLeagueDto: CreateLeagueDto) {
    const summoner = await this.summonerRepository.findOne({
      select: ['id'],
      where: { id: createLeagueDto.summonerId },
    });

    if (!summoner) {
      throw new Error(
        `Summoner with id ${createLeagueDto.summonerId} not found`,
      );
    }

    const league = this.leagueRepository.create(createLeagueDto);
    league.summoner = summoner;
    this.leagueRepository.insert(league);
    return league;
  }

  async findAll(region: string, summonerId: string) {
    let leagues = await this.leagueRepository
      .createQueryBuilder('league')
      .select(['league'])
      .innerJoin('league.summoner', 'summoner')
      .where('league.region = :region', { region })
      .andWhere('summoner.id = :summonerId', { summonerId })
      .getMany();

    if (leagues.length <= 0) {
      // Fetch league from Riot API
      const data = await this.riotService.fetchLeagueBySummonerId(
        region,
        summonerId,
      );
      // Save league to database
      leagues = [];
      data.forEach((league) => {
        let newLeague = new CreateLeagueDto();
        newLeague = { ...newLeague, ...league, region };
        leagues.push();
      });
    }
    return leagues;
  }

  update(leagueId: string, updateLeagueDto: UpdateLeagueDto) {
    return this.leagueRepository.update(leagueId, updateLeagueDto);
  }

  remove(leagueId: string) {
    return this.leagueRepository.softDelete(leagueId);
  }
}
