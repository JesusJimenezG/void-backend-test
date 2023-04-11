import { REPOSITORIES } from 'src/config/constants';
import { SummonerLeagueSummary } from '../entities/summoner-league-summary';

export const summaryProviders = [
  {
    provide: REPOSITORIES.SUMMARY,
    useFactory: (dataSource) => dataSource.getRepository(SummonerLeagueSummary),
    inject: [REPOSITORIES.SOURCE],
  },
];
