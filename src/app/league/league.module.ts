import { Module } from '@nestjs/common';
import { LeagueController } from './controller/league.controller';
import { LeagueService } from './service/league.service';
import { RiotAPIModule } from '../riot-api/riot.api.module';
import { SummonerModule } from '../summoner/summoner.module';
import { DatabaseModule } from '../../database/database.module';
import { leagueProviders } from './provider/league.provider';

@Module({
  imports: [DatabaseModule, RiotAPIModule, SummonerModule],
  controllers: [LeagueController],
  providers: [...leagueProviders, LeagueService],
  exports: [LeagueService],
})
export class LeagueModule {}
