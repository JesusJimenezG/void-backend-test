import { Test, TestingModule } from '@nestjs/testing';
import { LeagueService } from '../service/league.service';
import { leagueProviders } from '../provider/league.provider';
import { LeagueController } from '../controller/league.controller';

describe('LeagueService', () => {
  let service: LeagueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeagueController],
      providers: [...leagueProviders, LeagueService],
    }).compile();

    service = module.get<LeagueService>(LeagueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
