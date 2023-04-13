import { Module } from '@nestjs/common';
import { MatchService } from './services/match.service';
import { MatchController } from './controller/match.controller';
import { matchProviders } from './providers/match.providers';
import { DatabaseModule } from '../../database/database.module';
import { RiotAPIModule } from '../riot-api/riot.api.module';
import { SummonerModule } from '../summoner/summoner.module';

@Module({
  imports: [DatabaseModule, RiotAPIModule, SummonerModule],
  controllers: [MatchController],
  providers: [...matchProviders, MatchService],
})
export class MatchModule {}
