import { Test, TestingModule } from '@nestjs/testing';
import { LeagueService } from '../services/league.service';
import { LeagueController } from '../controller/league.controller';
import { ConfigModule } from '@nestjs/config';
import { dataSourceConfig } from '../../../database/data.source';
import { DataSource, Repository } from 'typeorm';
import { REPOSITORIES } from '../../../shared/constants/constants';
import { Summoner } from '../../summoner/entities/summoner.entity';
import { CreateLeagueDto } from '../dto/league.dto';
import { RiotAPIModule } from '../../../modules/riot-api/riot.api.module';
import { League } from '../entities/league.entity';
import { SummonerService } from '../../../modules/summoner/services/summoner.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('LeagueService', () => {
  let service: LeagueService;
  let controller: LeagueController;
  let summonerRepository: Repository<Summoner>;
  let dataSource: DataSource;
  let leagueRepository: Repository<League>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
          isGlobal: true,
        }),
        RiotAPIModule,
      ],
      controllers: [LeagueController],
      providers: [
        LeagueService,
        SummonerService,
        {
          provide: 'DATABASE_CONNECTION',
          useFactory: async () => {
            return new DataSource({ ...dataSourceConfig }).initialize();
          },
        },
        {
          provide: REPOSITORIES.SOURCE,
          useFactory: (dataSource: DataSource) => dataSource,
          inject: ['DATABASE_CONNECTION'],
        },
        {
          provide: REPOSITORIES.LEAGUE,
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(League),
          inject: ['DATABASE_CONNECTION'],
        },
        {
          provide: REPOSITORIES.SUMMONER,
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(Summoner),
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

    service = module.get<LeagueService>(LeagueService);
    controller = module.get<LeagueController>(LeagueController);
    leagueRepository = module.get<Repository<League>>(REPOSITORIES.LEAGUE);
    summonerRepository = module.get<Repository<Summoner>>(
      REPOSITORIES.SUMMONER,
    );
    dataSource = module.get<DataSource>('DATABASE_CONNECTION');
  });

  afterEach(async () => {
    await leagueRepository.query('DELETE FROM league');
    await summonerRepository.query('DELETE FROM summoner');
  });

  afterAll(async () => {
    await dataSource.destroy();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(summonerRepository).toBeDefined();
    expect(leagueRepository).toBeDefined();
    expect(dataSource).toBeDefined();
  });

  describe('create', () => {
    it('should return a newly created league', async () => {
      const region = 'LAN';
      const summoner: Summoner = {
        id: '1',
        name: 'FakerOnLan',
        region: region,
        accountId: '1',
        puuid: '1',
        summonerLevel: 1,
        profileIconId: 1,
        revisionDate: 1,
      };

      const leagueDTO: CreateLeagueDto = {
        leagueId: '1',
        queueType: 'RANKED_SOLO_5x5',
        tier: 'IRON',
        rank: 'I',
        summonerId: summoner.id,
        summonerName: summoner.name,
        leaguePoints: 0,
        wins: 0,
        losses: 0,
        freshBlood: false,
        hotStreak: false,
        inactive: false,
        veteran: false,
        region: 'LAN',
      };

      //   Add the summoner to the database
      const createdSummoner = await summonerRepository.save(summoner);
      expect(createdSummoner).toEqual(summoner);

      //   Spies
      const spyController = jest.spyOn(controller, 'create');
      const spyService = jest.spyOn(service, 'create');

      //   Call the service
      const createdLeague = await controller.create(region, leagueDTO);
      expect(createdLeague).toEqual(leagueDTO);
      expect(spyController).toBeCalledWith(region, leagueDTO);
      expect(spyService).toBeCalledWith(region, leagueDTO);
    });
  });
});
