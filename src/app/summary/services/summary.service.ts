import { SummonerService } from '../../summoner/services/summoner.service';
import { LeagueService } from '../../league/services/league.service';
import { PlayerSummaryDto } from '../dto/player_summary.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SummaryService {
  constructor(
    private readonly summonerService: SummonerService,
    private readonly leagueService: LeagueService,
  ) {}

  async getSummary(region: string, summonerName: string) {
    const summoner = await this.summonerService.findBySummonerName(
      region,
      summonerName,
    );
    const leagues = await this.leagueService.findBySummonerName(
      region,
      summoner.name,
    );

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
}
