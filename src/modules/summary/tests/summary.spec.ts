import { Test, TestingModule } from '@nestjs/testing';
import { SummaryController } from '../controller/summary.controller';
import { DataSource, Repository } from 'typeorm';
import { SummaryService } from '../services/summary.service';
import { PlayerSummary } from '../entities/player_summary.entity';
import { REPOSITORIES } from '../../../shared/constants/constants';
import { Summoner } from '../../../modules/summoner/entities/summoner.entity';
import { League } from '../../../modules/league/entities/league.entity';
import { ConfigModule } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MatchSummary } from '../entities/match_summary.entity';
import { SummonerService } from '../../../modules/summoner/services/summoner.service';
import { LeagueService } from '../../../modules/league/services/league.service';
import { MatchService } from '../../../modules/match/services/match.service';
import { RiotAPIModule } from '../../../modules/riot-api/riot.api.module';
import { dataSourceConfig } from '../../../database/data.source';

describe('SummaryController', () => {
  let controller: SummaryController;
  let service: SummaryService;
  let playerSummaryRepository: Repository<PlayerSummary>;

  const summoner1: Summoner = {
    accountId: '1',
    profileIconId: 1,
    revisionDate: 1,
    puuid: '1',
    summonerLevel: 1,
    id: '1',
    name: 'Summoner1',
    region: 'NA',
  };
  const summoner2: Summoner = {
    accountId: '2',
    profileIconId: 2,
    revisionDate: 2,
    puuid: '2',
    summonerLevel: 2,
    id: '2',
    name: 'Summoner2',
    region: 'NA',
  };

  const player: PlayerSummary = {
    playerId: '1',
    region: 'NA',
    summoner: summoner1,
    leagues: [],
  };
  const player2: PlayerSummary = {
    playerId: '2',
    region: 'NA',
    summoner: summoner2,
    leagues: [],
  };
  const league: League = {
    uuid: '1',
    wins: 10,
    losses: 5,
    freshBlood: false,
    hotStreak: false,
    inactive: false,
    veteran: false,
    leagueId: '1',
    leaguePoints: 25,
    queueType: 'RANKED_SOLO_5x5',
    rank: 'I',
    summoner: summoner1,
    tier: 'IRON',
    region: 'NA',
    player: player,
  };
  const league2: League = {
    uuid: '2',
    wins: 70,
    losses: 34,
    freshBlood: false,
    hotStreak: false,
    inactive: false,
    veteran: false,
    leagueId: '2',
    leaguePoints: 89,
    queueType: 'RANKED_SOLO_5x5',
    rank: 'I',
    summoner: summoner1,
    tier: 'IRON',
    region: 'NA',
    player: player,
  };
  const league3: League = {
    uuid: '3',
    wins: 9,
    losses: 12,
    freshBlood: false,
    hotStreak: false,
    inactive: false,
    veteran: false,
    leagueId: '1',
    leaguePoints: 15,
    queueType: 'RANKED_SOLO_5x5',
    rank: 'I',
    summoner: summoner2,
    tier: 'IRON',
    region: 'NA',
    player: player2,
  };
  const league4: League = {
    uuid: '4',
    wins: 32,
    losses: 34,
    freshBlood: false,
    hotStreak: false,
    inactive: false,
    veteran: false,
    leagueId: '2',
    leaguePoints: 21,
    queueType: 'RANKED_SOLO_5x5',
    rank: 'I',
    summoner: summoner2,
    tier: 'IRON',
    region: 'NA',
    player: player2,
  };

  const mockPlayerSummaries: PlayerSummary[] = [player, player2];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
          isGlobal: true,
        }),
        RiotAPIModule,
      ],
      controllers: [SummaryController],
      providers: [
        SummaryService,
        SummonerService,
        LeagueService,
        MatchService,
        {
          provide: 'DATABASE_CONNECTION',
          useFactory: () => {
            return new DataSource({ ...dataSourceConfig }).initialize();
          },
        },
        {
          provide: REPOSITORIES.SOURCE,
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(DataSource),
          inject: ['DATABASE_CONNECTION'],
        },
        {
          provide: REPOSITORIES.PLAYER_SUMMARY,
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(PlayerSummary),
          inject: ['DATABASE_CONNECTION'],
        },
        {
          provide: REPOSITORIES.MATCH_SUMMARY,
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(MatchSummary),
          inject: ['DATABASE_CONNECTION'],
        },
        {
          provide: REPOSITORIES.SUMMONER,
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(Summoner),
          inject: ['DATABASE_CONNECTION'],
        },
        {
          provide: REPOSITORIES.LEAGUE,
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(League),
          inject: ['DATABASE_CONNECTION'],
        },
        {
          provide: REPOSITORIES.MATCH,
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(MatchSummary),
          inject: ['DATABASE_CONNECTION'],
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SummaryController>(SummaryController);
    service = module.get<SummaryService>(SummaryService);
    playerSummaryRepository = module.get<Repository<PlayerSummary>>(
      REPOSITORIES.PLAYER_SUMMARY,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('getLeaderboard', () => {
    it('should return the correct leaderboard positions for a summoner', async () => {
      jest
        .spyOn(playerSummaryRepository, 'find')
        .mockResolvedValueOnce(mockPlayerSummaries);

      const result = await service.getLeaderboard('NA', 'Summoner1');

      // expect first summoner to be in first place
      expect(result).toEqual({
        leaguePoints: { top: 1 },
        winRate: { top: 1 },
      });
    });
  });
});
