import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LeagueModule } from '../modules/league/league.module';
// import { CacheModule } from '@nestjs/cache-manager';
// import { RedisClientOptions } from 'redis';
// import * as redisStore from 'cache-manager-redis-store';
import { SummonerModule } from '../modules/summoner/summoner.module';
import { SummaryModule } from '../modules/summary/summary.module';
import { MatchModule } from '../modules/match/match.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    // CacheModule.register<RedisClientOptions>({
    //   isGlobal: true,
    //   store: redisStore,
    //   url: process.env.REDIS_URL,
    //   ttl: 60 * 60 * 24,
    // }),
    SummonerModule,
    LeagueModule,
    SummaryModule,
    MatchModule,
  ],
})
export class AppModule {}
