import { REPOSITORIES } from 'src/shared/constants/constants';
import { PlayerSummary } from '../entities/player_summary.entity';
import { MatchSummary } from '../entities/match_summary.entity';

export const summaryProviders = [
  {
    provide: REPOSITORIES.PLAYER_SUMMARY,
    useFactory: (connection) => connection.getRepository(PlayerSummary),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.MATCH_SUMMARY,
    useFactory: (connection) => connection.getRepository(MatchSummary),
    inject: [REPOSITORIES.SOURCE],
  },
];
