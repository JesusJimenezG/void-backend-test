import { MatchInfo } from 'src/modules/match/entities/match.entity';
import { CreateLeagueDto } from '../../league/dto/league.dto';
import { Summoner } from '../../summoner/entities/summoner.entity';
import { MatchSummaryDTO } from '../dto/match_summary.dto';
import { PlayerSummaryDto } from '../dto/player_summary.dto';
import { MatchSummary } from '../entities/match_summary.entity';

export function mapToPlayerSummaryDto(
  summoner: Summoner,
  leagues: CreateLeagueDto[],
): PlayerSummaryDto[] {
  const playerSummary: PlayerSummaryDto[] = [];
  for (const league of leagues) {
    let player = new PlayerSummaryDto();
    player = { ...player, ...league, ...summoner };
    // player.summoner = summoner;
    // player.league = league;
    playerSummary.push(player);
  }

  return playerSummary;
}

export function mapToMatchSummaryDto(
  matches: MatchSummary[],
): MatchSummaryDTO[] {
  const matchSummary: MatchSummaryDTO[] = [];
  for (const match of matches) {
    // const matchDto = new MatchSummaryDTO();
    const { participants, challenges, MatchInfo, summoner, ...participant } =
      Object.assign(
        {},
        match.participant,
        match.participant.challenges,
        match.matchInfo,
        match.participant.summoner,
        { participants: undefined },
      );

    const { ...matchDto } = Object.assign({}, participant);

    matchSummary.push(matchDto);
  }
  return matchSummary;
}
