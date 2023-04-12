import { Module } from '@nestjs/common';
import { SummaryService } from './services/summary.service';
import { SummaryController } from './controller/summary.controller';
import { SummonerModule } from '../summoner/summoner.module';
import { LeagueModule } from '../league/league.module';

@Module({
  imports: [SummonerModule, LeagueModule],
  controllers: [SummaryController],
  providers: [SummaryService],
})
export class SummaryModule {}
