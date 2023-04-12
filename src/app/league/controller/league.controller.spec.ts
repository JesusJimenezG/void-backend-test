import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { RiotAPIModule } from '../../riot-api/riot.api.module';
import { CreateLeagueDto } from '../dto/create-league.dto';
import { UpdateLeagueDto } from '../dto/update-league.dto';
import { LeagueController } from './league.controller';
import { LeagueService } from '../service/league.service';
import { DataSource } from 'typeorm';
import { dataSourceConfig } from '../../../database/data.source';
import { REPOSITORIES } from '../../../config/constants';
import { League } from '../entities/league.entity';

describe('controller', () => {
  let controller: LeagueController;
  let service: LeagueService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
        {
          provide: 'DATABASE_CONNECTION',
          useFactory: async () => {
            return new DataSource({ ...dataSourceConfig }).initialize();
          },
        },
        {
          provide: REPOSITORIES.LEAGUE,
          useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(League),
          inject: ['DATABASE_CONNECTION'],
        },
        {
          provide: REPOSITORIES.SUMMONER,
          useValue: {
            insert: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LeagueController>(LeagueController);
    service = module.get<LeagueService>(LeagueService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new league', async () => {
      const mockCreateLeagueDto = new CreateLeagueDto();
      jest.spyOn(service, 'create').mockResolvedValueOnce(null);

      expect(await controller.create(mockCreateLeagueDto)).toEqual(null);
      expect(service.create).toHaveBeenCalledWith(mockCreateLeagueDto);
    });
  });

  describe('findAll', () => {
    it('should find leagues by region and summoner id', async () => {
      const region = 'na';
      const summonerId = '123';
      jest.spyOn(service, 'findAll').mockResolvedValueOnce([null]);
      expect(await controller.findAll(region, summonerId)).toEqual([null]);
      expect(service.findAll).toHaveBeenCalledWith(region, summonerId);
    });
  });

  describe('update', () => {
    it('should update an existing league', async () => {
      const leagueId = '456';
      const mockUpdateLeagueDto = new UpdateLeagueDto();
      jest.spyOn(service, 'update').mockResolvedValueOnce(null);
      expect(await controller.update(leagueId, mockUpdateLeagueDto)).toEqual(
        null,
      );
      expect(service.update).toHaveBeenCalledWith(
        leagueId,
        mockUpdateLeagueDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete an existing league', async () => {
      const leagueId = '789';
      jest.spyOn(service, 'remove').mockResolvedValueOnce(null);
      expect(await controller.remove(leagueId)).toEqual(null);
      expect(service.remove).toHaveBeenCalledWith(leagueId);
    });
  });
});
