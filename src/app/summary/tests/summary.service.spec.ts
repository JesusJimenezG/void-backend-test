import { Test, TestingModule } from '@nestjs/testing';
import { SummaryService } from '../services/summary.service';
import { LeagueModule } from '../../league/league.module';
import { SummonerModule } from '../../summoner/summoner.module';
import { ConfigModule } from '@nestjs/config';

describe('SummaryService', () => {
  let service: SummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SummonerModule, LeagueModule],
      providers: [SummaryService],
    }).compile();

    service = module.get<SummaryService>(SummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
