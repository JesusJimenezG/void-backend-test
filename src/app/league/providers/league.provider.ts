import { League } from '../entities/league.entity';
import { REPOSITORIES } from '../../../config/constants';
import { DataSource } from 'typeorm';

export const leagueProviders = [
  {
    provide: REPOSITORIES.LEAGUE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(League),
    inject: [REPOSITORIES.SOURCE],
  },
];
