import { REPOSITORIES } from 'src/config/constants';
import { Summoner } from '../entities/summoner.entity';

export const summonerProviders = [
  {
    provide: REPOSITORIES.SUMMONER_REPOSITORY,
    useFactory: (dataSource) => dataSource.getRepository(Summoner),
    inject: [REPOSITORIES.SOURCE],
  },
];
