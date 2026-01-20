import { CreateLeagueDto } from '../dto/league.dto';
import { League } from '../entities/league.entity';

export function mapLeagueToDto(league: League): CreateLeagueDto {
  const dto = new CreateLeagueDto();
  dto.leagueId = league.leagueId;
  dto.summonerId = league.summoner.id;
  dto.summonerName = league.summoner.name;
  dto.queueType = league.queueType;
  dto.tier = league.tier;
  dto.rank = league.rank;
  dto.leaguePoints = league.leaguePoints;
  dto.wins = league.wins;
  dto.losses = league.losses;
  dto.hotStreak = league.hotStreak;
  dto.veteran = league.veteran;
  dto.freshBlood = league.freshBlood;
  dto.inactive = league.inactive;
  dto.region = league.region;
  return dto;
}
