import { SummonerService } from '../../summoner/services/summoner.service';
import { LeagueService } from '../../league/services/league.service';
import { Injectable } from '@nestjs/common';
import { mapSummaryToPlayerSummaryDto } from './service.utils';

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

    const playerSummary = mapSummaryToPlayerSummaryDto(summoner, leagues);
    return playerSummary;
  }
}
