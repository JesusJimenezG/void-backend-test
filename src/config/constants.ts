import { getRepositoryToken } from '@nestjs/typeorm';
import { League } from '../app/league/entities/league.entity';
import { Summoner } from '../app/summoner/entities/summoner.entity';
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
  PerkStyleSelection,
  Perks,
  Team,
} from 'src/app/match/entities/match.entity';

export const SWAGGER = {
  path: 'docs',
  title: 'Riot API endpoints integration example',
  description: 'API endpoints integration example with NestJS and Riot API',
  version: '0.0.1',
  tags: ['Summoner', 'League', 'Player Summary', 'Player Matches'],
};

export const REPOSITORIES = {
  SOURCE: 'DATA_SOURCE',
  SUMMONER: getRepositoryToken(Summoner),
  LEAGUE: getRepositoryToken(League),
  MATCH: getRepositoryToken(Match),
  MATCHMETADATA: getRepositoryToken(MatchMetadata),
  MATCHINFO: getRepositoryToken(MatchInfo),
  PARTICIPANT: getRepositoryToken(Participant),
  CHALLENGE: getRepositoryToken(Challenge),
  TEAM: getRepositoryToken(Team),
  BAN: getRepositoryToken(Ban),
  OBJECTIVES: getRepositoryToken(Objectives),
  OBJECTIVE: getRepositoryToken(Objective),
  PERKS: getRepositoryToken(Perks),
  PERKSTATS: getRepositoryToken(PerkStats),
  PERKSTYLE: getRepositoryToken(PerkStats),
  PERKSTYLESELECTION: getRepositoryToken(PerkStyleSelection),
};

export const GLOBAL_PREFIX = 'api';

export const REGIONS = {
  BR1: 'BR1',
  EUN1: 'EUN1',
  EUW1: 'EUW1',
  JP1: 'JP1',
  KR: 'KR',
  LA1: 'LA1',
  LA2: 'LA2',
  NA1: 'NA1',
  OC1: 'OC1',
  PH2: 'PH2',
  RU: 'RU',
  SG2: 'SG2',
  TH2: 'TH2',
  TR1: 'TR1',
  TW2: 'TW2',
  VN2: 'VN2',
};

export const SERVERS = {
  AMERICAS: 'AMERICAS',
  ASIA: 'ASIA',
  EUROPE: 'EUROPE',
  SEA: 'SEA',
};
