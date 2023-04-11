import { Module } from '@nestjs/common';
import { SummonerModule } from './summoner/summoner.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from 'src/config/data.source';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { LeagueModule } from './league/league.module';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dataSourceConfig }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    SummonerModule,
    LeagueModule,
    SummaryModule,
  ],
})
export class AppModule {}
