import { Test, TestingModule } from '@nestjs/testing';
import { SummonerService } from '../service/summoner.service';
import { Summoner } from '../entities/summoner.entity';
import { RiotAPIModule } from '../../riot-api/riot.api.module';
import { ConfigModule } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { dataSourceConfig } from '../../../database/data.source';
import { REPOSITORIES } from '../../../config/constants';
import { CreateSummonerDto } from '../dto/create-summoner.dto';
import { SummonerController } from '../controller/summoner.controller';

describe('SummonerService', () => {
  let service: SummonerService;
  let controller: SummonerController;
  let repository: Repository<Summoner>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RiotAPIModule,
        ConfigModule.forRoot({
          envFilePath: `.env.${process.env.NODE_ENV}`,
          isGlobal: true,
        }),
      ],
      controllers: [SummonerController],
      providers: [
        SummonerService,
        {
          provide: 'DATABASE_CONNECTION',
          useFactory: async () => {
            return new DataSource({ ...dataSourceConfig }).initialize();
          },
        },
        {
          provide: REPOSITORIES.SUMMONER,
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(Summoner),
          inject: ['DATABASE_CONNECTION'],
        },
      ],
    }).compile();

    service = module.get<SummonerService>(SummonerService);
    controller = module.get<SummonerController>(SummonerController);
    repository = module.get<Repository<Summoner>>(REPOSITORIES.SUMMONER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return a newly created summoner', async () => {
      const summonerDTO: CreateSummonerDto = {
        accountId: 'accountId',
        profileIconId: 0,
        revisionDate: 0,
        name: 'name',
        id: 'summonerId',
        puuid: 'puuid',
        summonerLevel: 0,
        region: 'LAN',
      };

      const insertResult = {
        identifiers: [{ id: 'summonerId' }],
        generatedMaps: [],
        raw: null,
      };

      const expected = {
        accountId: summonerDTO.accountId,
        profileIconId: summonerDTO.profileIconId,
        revisionDate: summonerDTO.revisionDate,
        name: summonerDTO.name,
        id: summonerDTO.id,
        puuid: summonerDTO.puuid,
        summonerLevel: summonerDTO.summonerLevel,
        region: summonerDTO.region,
        ...insertResult,
      };

      const spy = jest
        .spyOn(service, 'create')
        .mockReturnValue(Promise.resolve(expected));

      expect(await controller.create(summonerDTO)).toEqual(expected);
      expect(spy).toBeCalledWith(summonerDTO);
    });
  });
});
