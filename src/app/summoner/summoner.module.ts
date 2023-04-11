import { Module } from '@nestjs/common';
import { SummonerService } from './service/summoner.service';
import { SummonerController } from './controller/summoner.controller';
import { DatabaseModule } from '../../database/database.module';
import { summonerProviders } from './provider/summoner.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [SummonerController],
  providers: [...summonerProviders, SummonerService],
})
export class SummonerModule {}
