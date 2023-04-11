import { REPOSITORIES } from 'src/config/constants';
import { League } from '../entities/league.entity';

export const leagueProviders = [
  {
    provide: REPOSITORIES.LEAGUE,
    useFactory: (dataSource) => dataSource.getRepository(League),
    inject: [REPOSITORIES.SOURCE],
  },
];
