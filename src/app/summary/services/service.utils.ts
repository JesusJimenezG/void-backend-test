import { CreateLeagueDto } from '../../league/dto/league.dto';
import { Summoner } from '../../summoner/entities/summoner.entity';
import { PlayerSummaryDto } from '../dto/player_summary.dto';

export function mapSummaryToPlayerSummaryDto(
  summoner: Summoner,
  leagues: CreateLeagueDto[],
) {
  const playerSummary = new PlayerSummaryDto();
  playerSummary.name = summoner.name;
  playerSummary.image = summoner.profileIconId;
  playerSummary.league = [
    ...leagues.map((league) => {
      return {
        queueType: league.queueType,
        tier: league.tier,
        rank: league.rank,
        leaguePoints: league.leaguePoints,
        wins: league.wins,
        losses: league.losses,
      };
    }),
  ];

  return playerSummary;
}
