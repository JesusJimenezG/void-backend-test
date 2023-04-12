import { getRepositoryToken } from '@nestjs/typeorm';
import { League } from '../app/league/entities/league.entity';
import { Summoner } from '../app/summoner/entities/summoner.entity';

export const SWAGGER = {
  path: 'docs',
  title: 'Riot API endpoints integration example',
  description: 'API endpoints integration example with NestJS and Riot API',
  version: '0.0.1',
  tags: ['Summoner', 'League', 'Player Summary'],
};

export const REPOSITORIES = {
  SOURCE: 'DATA_SOURCE',
  SUMMONER: getRepositoryToken(Summoner),
  LEAGUE: getRepositoryToken(League),
};

export const GLOBAL_PREFIX = 'api';
