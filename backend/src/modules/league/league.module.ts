import { Module } from '@nestjs/common';
import { LeagueController } from './controller/league.controller';
import { LeagueService } from './services/league.service';
import { SummonerModule } from '../summoner/summoner.module';
import { DatabaseModule } from '../../database/database.module';
import { leagueProviders } from './providers/league.provider';
import { RiotAPIModule } from '../riot-api/riot.api.module';

@Module({
  imports: [DatabaseModule, RiotAPIModule, SummonerModule],
  controllers: [LeagueController],
  providers: [...leagueProviders, LeagueService],
  exports: [LeagueService],
})
export class LeagueModule {}
