import { SummonerService } from '../../summoner/services/summoner.service';
import { LeagueService } from '../../league/services/league.service';
import { Injectable } from '@nestjs/common';
import {
  mapToMatchSummaryDto,
  mapToPlayerSummaryDto,
} from '../utils/summary.service.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerSummary } from '../entities/player_summary.entity';
import { Repository } from 'typeorm';
import { MatchService } from '../../../modules/match/services/match.service';
import { MatchSummary } from '../entities/match_summary.entity';
import { PageOptionsDto } from '../../../shared/pagination/page-options.dto';
import { PageDto } from '../../../shared/pagination/page.dto';
import { PageMetaDto } from '../../../shared/pagination/page-meta.dto';

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(PlayerSummary)
    private playerSummaryRepository: Repository<PlayerSummary>,
    @InjectRepository(MatchSummary)
    private matchSummaryRepository: Repository<MatchSummary>,
    private readonly summonerService: SummonerService,
    private readonly leagueService: LeagueService,
    private readonly matchService: MatchService,
  ) {}

  async getPlayerRecentMatches(
    region: string,
    summonerName: string,
    pageOptionsDto: PageOptionsDto,
  ) {
    const summoner = await this.summonerService.findBySummonerName(
      region,
      summonerName,
    );
    const { data } = await this.matchService.findRecentSummonerMatches(
      region,
      summoner.name,
      pageOptionsDto,
    );

    const recentMatchesSummary: MatchSummary[] = [];
    for (const match of data) {
      let matchSummary = await this.matchSummaryRepository.findOne({
        relations: ['matchInfo', 'participant'],
        where: { matchInfo: { matchId: match.info.matchId } },
      });

      if (!matchSummary) {
        const newMatchSummary = new MatchSummary();
        newMatchSummary.matchInfo = match.info;
        newMatchSummary.participant = match.info.participants[0];
        newMatchSummary.region = region;
        matchSummary = await this.matchSummaryRepository.save(newMatchSummary);
      }
      recentMatchesSummary.push(matchSummary);
    }

    const matchSummary = mapToMatchSummaryDto(recentMatchesSummary);
    const pageMetaDto = new PageMetaDto({
      itemCount: matchSummary.length,
      pageOptionsDto,
    });
    return new PageDto(matchSummary, pageMetaDto);
    // return matchSummary;
  }

  async getPlayerSummary(
    region: string,
    summonerName: string,
    queueId?: string,
  ) {
    const summoner = await this.summonerService.findBySummonerName(
      region,
      summonerName,
    );

    let player = await this.playerSummaryRepository.findOne({
      relations: ['summoner', 'leagues'],
      where: { summoner: { id: summoner.id } },
    });

    if (!player) {
      player = new PlayerSummary();
      player.summoner = summoner;
      player.region = region;
      await this.playerSummaryRepository.save(player);
    }

    const leagues = await this.leagueService.findBySummonerName(
      region,
      summoner.name,
      queueId,
    );

    const playerSummary = mapToPlayerSummaryDto(summoner, leagues);
    return playerSummary;
  }

  async getLeaderboard(region: string, summonerName: string) {
    // Get all player summaries for the given region
    const playerSummaries = await this.playerSummaryRepository.find({
      relations: ['summoner', 'leagues'],
      where: { region },
    });

    // Flatten leagues for each player summary
    playerSummaries.forEach((playerSummary) => {
      playerSummary.leagues = playerSummary.leagues.flat();
    });

    // Calculate total wins, losses, and league points for each player summary
    const stats = playerSummaries.map((playerSummary) => {
      const wins = playerSummary.leagues.reduce(
        (total, league) => total + league.wins,
        0,
      );
      const losses = playerSummary.leagues.reduce(
        (total, league) => total + league.losses,
        0,
      );
      const leaguePoints = playerSummary.leagues.reduce(
        (total, league) => total + league.leaguePoints,
        0,
      );

      return {
        playerId: playerSummary.playerId,
        wins,
        losses,
        leaguePoints,
      };
    });

    // Sort by league points
    const leaguePointsSorted = [...stats].sort(
      (a, b) => b.leaguePoints - a.leaguePoints,
    );
    // Calculate positions
    const leaguePointsPositions = new Map<string, number>();
    leaguePointsSorted.forEach((stat, index) => {
      leaguePointsPositions.set(stat.playerId, index + 1);
    });

    // Sort by win rate
    const winRateSorted = [...stats].sort(
      (a, b) => b.wins / (b.wins + b.losses) - a.wins / (a.wins + a.losses),
    );
    // Calculate positions
    const winRatePositions = new Map<string, number>();
    winRateSorted.forEach((stat, index) => {
      winRatePositions.set(stat.playerId, index + 1);
    });

    // Get the player summary for the given summoner name
    const summonerPlayerSummary = playerSummaries.find(
      (playerSummary) => playerSummary.summoner.name === summonerName,
    );

    return {
      leaguePoints: {
        top: leaguePointsPositions.get(summonerPlayerSummary.playerId),
      },
      winRate: { top: winRatePositions.get(summonerPlayerSummary.playerId) },
    };
  }
}
