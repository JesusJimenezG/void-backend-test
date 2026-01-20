import { Controller, Get, Param, UseInterceptors, Query } from '@nestjs/common';
import { SummaryService } from '../services/summary.service';
import { ApiTags } from '@nestjs/swagger';
import { RegionInterceptor } from '../../../shared/interceptors/region.interceptor';
import { PageOptionsDto } from '../../../shared/pagination/page-options.dto';

@ApiTags('Player Summary')
@Controller('summary')
@UseInterceptors(RegionInterceptor)
export class SummaryController {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private readonly cacheManager: Cache,
    private readonly summaryService: SummaryService,
  ) {}

  // @UseInterceptors(CacheInterceptor)
  @Get(':region/leaderboard')
  getLeaderboard(@Param('region') region: string) {
    return this.summaryService.getLeaderboard(region);
  }

  // @UseInterceptors(CacheInterceptor)
  @Get(':region/:gameName/:tagLine/matches')
  getPlayerRecentMatches(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
    @Query() pageOptionsDto?: PageOptionsDto,
  ) {
    return this.summaryService.getPlayerRecentMatches(
      region,
      gameName,
      tagLine,
      pageOptionsDto,
    );
  }

  // @UseInterceptors(CacheInterceptor)
  @Get(':region/:gameName/:tagLine')
  getPlayerSummary(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
    @Query('queueId') queueId?: string,
  ) {
    return this.summaryService.getPlayerSummary(
      region,
      gameName,
      tagLine,
      queueId,
    );
  }

  // @UseInterceptors(CacheInterceptor)
  @Get(':region/:gameName/:tagLine/leaderboard')
  getLeaderboardBySummonerName(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
  ) {
    return this.summaryService.getLeaderboardBySummonerName(
      region,
      gameName,
      tagLine,
    );
  }
}
