import { Module } from '@nestjs/common';
import { SummonerModule } from './summoner/summoner.module';
import { ConfigModule } from '@nestjs/config';
import { LeagueModule } from './league/league.module';
import { SummaryModule } from './summary/summary.module';
import { MatchModule } from './match/match.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL,
      ttl: 60 * 60 * 24,
    }),
    SummonerModule,
    LeagueModule,
    SummaryModule,
    MatchModule,
  ],
})
export class AppModule {}
