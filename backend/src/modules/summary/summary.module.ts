import { Module } from '@nestjs/common';
import { SummaryService } from './services/summary.service';
import { SummaryController } from './controller/summary.controller';
import { SummonerModule } from '../summoner/summoner.module';
import { LeagueModule } from '../league/league.module';
import { MatchModule } from '../match/match.module';
import { summaryProviders } from './providers/summary.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule, SummonerModule, LeagueModule, MatchModule],
  controllers: [SummaryController],
  providers: [...summaryProviders, SummaryService],
})
export class SummaryModule {}
