import { SummonerService } from '../../summoner/services/summoner.service';
import { LeagueService } from '../../league/services/league.service';
import { Injectable, Inject } from '@nestjs/common';
import { mapToMatchSummaryDto } from '../utils/summary.service.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerSummary } from '../entities/player_summary.entity';
import { Repository, DataSource } from 'typeorm';
import { MatchService } from '../../../modules/match/services/match.service';
import { MatchSummary } from '../entities/match_summary.entity';
import { PageOptionsDto } from '../../../shared/pagination/page-options.dto';
import { PageDto } from '../../../shared/pagination/page.dto';
import { PageMetaDto } from '../../../shared/pagination/page-meta.dto';
import { Order, REPOSITORIES } from '../../../shared/constants/constants';
import { Participant } from '../../../modules/match/entities/match.entity';

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
    @Inject(REPOSITORIES.SOURCE)
    private readonly dataSource: DataSource,
  ) {}

  async getPlayerRecentMatches(
    region: string,
    gameName: string,
    tagLine: string,
    pageOptionsDto: PageOptionsDto,
  ) {
    const summoner = await this.summonerService.findByRiotId(
      region,
      gameName,
      tagLine,
    );

    const { data } = await this.matchService.findRecentSummonerMatches(
      region,
      gameName,
      tagLine,
      pageOptionsDto,
    );

    const recentMatchesSummary: MatchSummary[] = [];
    for (const match of data) {
      // Try to find existing MatchSummary for this match and participant (via summoner relation)
      let matchSummary = await this.matchSummaryRepository.findOne({
        relations: ['matchInfo', 'participant', 'participant.summoner'],
        where: {
          matchInfo: { matchId: match.info.matchId },
          participant: { summoner: { puuid: summoner.puuid } },
        },
      });

      if (!matchSummary) {
        // Find the correct participant entity for this summoner
        const participantEntity = await this.dataSource
          .getRepository(Participant)
          .findOne({
            where: {
              matchInfo: { matchId: match.info.matchId },
              summoner: { puuid: summoner.puuid },
            },
            relations: ['matchInfo', 'summoner', 'challenges'],
          });

        if (!participantEntity) {
          // Skip if for some reason the entity isn't found (should be there if matchService did its job)
          continue;
        }

        const newMatchSummary = new MatchSummary();
        newMatchSummary.matchInfo = participantEntity.matchInfo;
        newMatchSummary.participant = participantEntity;
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
  }

  async getPlayerSummary(
    region: string,
    gameName: string,
    tagLine: string,
    queueId?: string,
  ) {
    // 1. Fetch Summoner
    const summoner = await this.summonerService.findByRiotId(
      region,
      gameName,
      tagLine,
    );

    // 2. Fetch Ranked Entries (Leagues)
    const rankedEntries = await this.leagueService.findByRiotId(
      region,
      gameName,
      tagLine,
      queueId,
    );

    // 3. Fetch Recent Matches (Default 10, Descending Order)
    // We reuse the match service to get the recent matches
    const pageOptionsDto = Object.assign(new PageOptionsDto(), {
      take: 10,
      order: Order.DESC,
    });

    const matchesResult = await this.matchService.findRecentSummonerMatches(
      region,
      gameName,
      tagLine,
      pageOptionsDto,
    );

    // 4. Construct SummaryDTO
    return {
      summoner: summoner,
      rankedEntries: rankedEntries,
      recentMatches: matchesResult.data,
    };
  }

  async getLeaderboard(region: string) {
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

      const riotId =
        playerSummary.summoner.gameName && playerSummary.summoner.tagLine
          ? `${playerSummary.summoner.gameName}#${playerSummary.summoner.tagLine}`
          : playerSummary.summoner.name;

      return {
        summonerName: riotId,
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
      leaguePointsPositions.set(stat.summonerName, index + 1);
    });

    // Sort by win rate
    const winRateSorted = [...stats].sort(
      (a, b) => b.wins / (b.wins + b.losses) - a.wins / (a.wins + a.losses),
    );
    // Calculate positions
    const winRatePositions = new Map<string, number>();
    winRateSorted.forEach((stat, index) => {
      winRatePositions.set(stat.summonerName, index + 1);
    });

    // Build the output object
    const output = {};
    stats.forEach((stat) => {
      output[stat.summonerName] = {
        leaguePoints: {
          top: leaguePointsPositions.get(stat.summonerName),
        },
        winRate: {
          top: winRatePositions.get(stat.summonerName),
        },
      };
    });

    return output;
  }

  async getLeaderboardBySummonerName(
    region: string,
    gameName: string,
    tagLine: string,
  ) {
    const leaderboard = await this.getLeaderboard(region);
    return leaderboard[`${gameName}#${tagLine}`];
  }
}
