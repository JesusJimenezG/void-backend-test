import { DataSource } from 'typeorm';
import { REPOSITORIES } from '../../../config/constants';
import {
  Ban,
  Challenge,
  Match,
  MatchInfo,
  MatchMetadata,
  Objective,
  Objectives,
  Participant,
  PerkStats,
  PerkStyle,
  PerkStyleSelection,
  Perks,
  Team,
} from '../entities/match.entity';

export const matchProviders = [
  {
    provide: REPOSITORIES.MATCH,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Match),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.MATCHMETADATA,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MatchMetadata),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.MATCHINFO,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(MatchInfo),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.PARTICIPANT,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Participant),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.CHALLENGE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Challenge),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.TEAM,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Team),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.BAN,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Ban),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.OBJECTIVES,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Objectives),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.OBJECTIVE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Objective),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.PERKS,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Perks),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.PERKSTATS,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PerkStats),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.PERKSTYLE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(PerkStyle),
    inject: [REPOSITORIES.SOURCE],
  },
  {
    provide: REPOSITORIES.PERKSTYLESELECTION,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PerkStyleSelection),
    inject: [REPOSITORIES.SOURCE],
  },
];
