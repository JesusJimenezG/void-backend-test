import { Module } from '@nestjs/common';
import { SummonerModule } from './summoner/summoner.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceConfig } from 'src/config/data.source';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    SummonerModule,
    TypeOrmModule.forRoot({ ...dataSourceConfig }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
