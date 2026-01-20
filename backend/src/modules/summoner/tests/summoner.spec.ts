import { Test, TestingModule } from '@nestjs/testing';
import { SummonerService } from '../services/summoner.service';
import { Summoner } from '../entities/summoner.entity';
import { RiotAPIModule } from '../../riot-api/riot.api.module';
import { ConfigModule } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { dataSourceConfig } from '../../../database/data.source';
import { REPOSITORIES } from '../../../shared/constants/constants';
import { SummonerController } from '../controller/summoner.controller';
import { CreateSummonerDto } from '../dto/summoner.dto';

describe('SummonerService', () => {
  let service: SummonerService;
  let controller: SummonerController;
  let repository: Repository<Summoner>;
  let dataSource: DataSource;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
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
    dataSource = module.get<DataSource>('DATABASE_CONNECTION');
  });

  afterEach(async () => {
    await repository.query('DELETE FROM summoner');
  });

  afterAll(async () => {
    await dataSource.destroy();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
    expect(repository).toBeDefined();
    expect(dataSource).toBeDefined();
  });

  describe('create', () => {
    it('should return a newly created summoner', async () => {
      const region = 'LAN';
      const summonerDTO = new CreateSummonerDto();
      summonerDTO.name = 'FakerOnLan';
      summonerDTO.region = region;

      const expected = new Summoner();
      expected.name = summonerDTO.name;
      expected.region = summonerDTO.region;

      const spy = jest.spyOn(service, 'create').mockReturnValue(expected);

      expect(await controller.create(region, summonerDTO)).toEqual(expected);
      expect(spy).toBeCalledWith(region, summonerDTO);
    });
  });

  describe('findAll', () => {
    it('should return an array of summoners', async () => {
      const region = 'LAN';
      const summoner = new Summoner();
      summoner.name = 'Faker';
      summoner.region = region;

      const spy = jest
        .spyOn(service, 'findAll')
        .mockReturnValue(Promise.resolve([summoner]));

      expect(await controller.findAll(region)).toEqual([summoner]);

      expect(spy).toBeCalledWith(region);
    });
  });

  describe('findBySummonerName', () => {
    it('should return a summoner', async () => {
      const region = 'LAN';
      const summonerName = 'Faker';
      const summoner = new Summoner();
      summoner.name = summonerName;
      summoner.region = region;

      const spy = jest
        .spyOn(service, 'findBySummonerName')
        .mockReturnValue(Promise.resolve(summoner));

      expect(await controller.findBySummonerName(region, summonerName)).toEqual(
        summoner,
      );
      expect(spy).toBeCalledWith(region, summonerName);
    });
  });

  describe('update', () => {
    it('should return an updated summoner', async () => {
      const region = 'LAN';
      const summonerName = 'Faker';
      const summoner = new Summoner();
      summoner.name = summonerName;
      summoner.region = region;

      const updateResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };

      const spy = jest
        .spyOn(service, 'update')
        .mockReturnValue(Promise.resolve(updateResult));

      const response = await controller.update(region, summonerName, summoner);
      expect(response).toEqual(updateResult);
      expect(spy).toBeCalledWith(region, summonerName, summoner);
    });
  });

  describe('remove', () => {
    it('should return a removed summoner', async () => {
      const region = 'LAN';
      const summonerName = 'Faker';
      const summoner = new Summoner();
      summoner.name = summonerName;
      summoner.region = region;

      const deleteResult = {
        generatedMaps: [],
        raw: [],
        affected: 1,
      };

      const spy = jest
        .spyOn(service, 'remove')
        .mockReturnValue(Promise.resolve(deleteResult));

      const response = await controller.remove(region, summonerName);
      expect(response).toEqual(deleteResult);
      expect(spy).toBeCalledWith(region, summonerName);
    });
  });
});
