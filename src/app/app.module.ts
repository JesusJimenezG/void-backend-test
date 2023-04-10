import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummonerController } from './summoner/summoner.controller';
import { SummonerService } from './summoner/summoner.service';

@Module({
  imports: [],
  controllers: [AppController, SummonerController],
  providers: [AppService, SummonerService],
})
export class AppModule {}
