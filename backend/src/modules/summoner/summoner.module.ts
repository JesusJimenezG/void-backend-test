import { Module } from '@nestjs/common';
import { SummonerService } from './services/summoner.service';
import { SummonerController } from './controller/summoner.controller';
import { RiotAPIModule } from '../riot-api/riot.api.module';
import { DatabaseModule } from '../../database/database.module';
import { summonerProviders } from './providers/summoner.provider';

@Module({
  imports: [DatabaseModule, RiotAPIModule],
  controllers: [SummonerController],
  providers: [...summonerProviders, SummonerService],
  exports: [...summonerProviders, SummonerService],
})
export class SummonerModule {}
