import { Summoner } from '../entities/summoner.entity';
import { REPOSITORIES } from '../../../shared/constants/constants';
import { DataSource } from 'typeorm';

export const summonerProviders = [
  {
    provide: REPOSITORIES.SUMMONER,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Summoner),
    inject: [REPOSITORIES.SOURCE],
  },
];
