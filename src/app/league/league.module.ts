import { Module } from '@nestjs/common';
import { LeagueController } from './controller/league.controller';
import { LeagueService } from './service/league.service';
import { DatabaseModule } from 'src/database/database.module';
import { HttpModule } from '@nestjs/axios';
import { leagueProviders } from './provider/league.provider';
import { RiotAPIService } from '../riot-api/riot.api.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [LeagueController],
  providers: [...leagueProviders, LeagueService, RiotAPIService],
})
export class LeagueModule {}
