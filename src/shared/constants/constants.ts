import { getRepositoryToken } from '@nestjs/typeorm';
import { League } from '../../modules/league/entities/league.entity';
import { Summoner } from '../../modules/summoner/entities/summoner.entity';
import {
  Challenge,
  Match,
  MatchInfo,
  MatchMetadata,
  Participant,
} from '../../modules/match/entities/match.entity';
import { PlayerSummary } from '../../modules/summary/entities/player_summary.entity';
import { MatchSummary } from '../../modules/summary/entities/match_summary.entity';

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
  PLAYER_SUMMARY: getRepositoryToken(PlayerSummary),
  MATCH_SUMMARY: getRepositoryToken(MatchSummary),
  // TEAM: getRepositoryToken(Team),
  // OBJECTIVES: getRepositoryToken(Objectives),
  // OBJECTIVE: getRepositoryToken(Objective),
};

export const GLOBAL_PREFIX = 'api';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

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

export const QUEUE_TYPES = {
  420: 'RANKED_SOLO_5x5',
  440: 'RANKED_FLEX_SR',
  450: 'ARAM',
  430: 'NORMAL_BLIND_PICK',
  400: 'NORMAL_DRAFT_PICK',
  700: 'CLASH',
  0: 'ALL',
};
