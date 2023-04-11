import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SummonerService } from './service/summoner.service';
import { SummonerController } from './controller/summoner.controller';
import { DatabaseModule } from '../../database/database.module';
import { summonerProviders } from './provider/summoner.providers';
import { RiotAPIService } from '../riot-api/riot.api.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [SummonerController],
  providers: [...summonerProviders, SummonerService, RiotAPIService],
})
export class SummonerModule {}
