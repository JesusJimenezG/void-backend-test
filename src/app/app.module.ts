import { Module } from '@nestjs/common';
import { SummonerModule } from './summoner/summoner.module';
import { ConfigModule } from '@nestjs/config';
import { LeagueModule } from './league/league.module';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: async (configService) => {
    //     return await getTypeOrmConfig(configService);
    //   },
    //   inject: [ConfigService],
    // }),
    SummonerModule,
    LeagueModule,
    SummaryModule,
  ],
})
export class AppModule {}
