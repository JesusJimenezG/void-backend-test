import { Inject, Injectable } from '@nestjs/common';
import { CreateLeagueDto } from '../dto/create-league.dto';
import { UpdateLeagueDto } from '../dto/update-league.dto';
import { REPOSITORIES } from 'src/config/constants';
import { League } from '../entities/league.entity';
import { Repository, getRepository } from 'typeorm';
import { RiotAPIService } from 'src/app/riot-api/riot.api.service';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import dataSource from 'src/config/data.source';
import { Summoner } from 'src/app/summoner/entities/summoner.entity';

@Injectable()
export class LeagueService {
  constructor(
    @Inject(REPOSITORIES.LEAGUE)
    private leagueRepository: Repository<League>,
    private readonly riotService: RiotAPIService,
  ) {}

  async create(createLeagueDto: CreateLeagueDto) {
    const summonerRepository = dataSource.getRepository(Summoner);
    const summoner = await summonerRepository.findOne({
      select: ['id'],
      where: { id: createLeagueDto.summonerId },
    });

    if (!summoner) {
      throw new Error(
        `Summoner with id ${createLeagueDto.summonerId} not found`,
      );
    }
    const league = new League();
    league.leagueId = createLeagueDto.leagueId;
    league.summoner = summoner;
    league.queueType = createLeagueDto.queueType;
    league.tier = createLeagueDto.tier;
    league.rank = createLeagueDto.rank;
    league.leaguePoints = createLeagueDto.leaguePoints;
    league.wins = createLeagueDto.wins;
    league.losses = createLeagueDto.losses;
    league.hotStreak = createLeagueDto.hotStreak;
    league.veteran = createLeagueDto.veteran;
    league.freshBlood = createLeagueDto.freshBlood;
    league.inactive = createLeagueDto.inactive;
    league.region = createLeagueDto.region;

    return this.leagueRepository.insert(league);
  }

  // findAll() {
  //   return `This action returns all league`;
  // }

  async findOne(region: string, summonerId: string) {
    const league = await this.leagueRepository
      .createQueryBuilder('league')
      .select(['league'])
      .innerJoin('league.summoner', 'summoner')
      .where('league.region = :region', { region })
      .andWhere('summoner.id = :summonerId', { summonerId })
      .getMany();

    console.log('query: ', league);

    if (!league) {
      // Fetch league from Riot API
      const url = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`;
      const data = await this.riotService.fetchFromRiotAPI(url);
      // Save league to database
      data.forEach((league) => {
        let newLeague = new CreateLeagueDto();
        newLeague = { ...newLeague, ...league, region };
        this.create(newLeague);
      });
    }
    return league;
  }

  // update(id: number, updateLeagueDto: UpdateLeagueDto) {
  //   return `This action updates a #${id} league`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} league`;
  // }
}
