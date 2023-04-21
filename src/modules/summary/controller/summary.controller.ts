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
  @Get(':region/:summonerName/matches')
  getPlayerRecentMatches(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
    @Query() pageOptionsDto?: PageOptionsDto,
  ) {
    return this.summaryService.getPlayerRecentMatches(
      region,
      summonerName,
      pageOptionsDto,
    );
  }

  // @UseInterceptors(CacheInterceptor)
  @Get(':region/:summonerName')
  getPlayerSummary(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
    @Query('queueId') queueId?: string,
  ) {
    return this.summaryService.getPlayerSummary(region, summonerName, queueId);
  }

  // @UseInterceptors(CacheInterceptor)
  @Get(':region/:summonerName/leaderboard')
  getLeaderboardBySummonerName(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
  ) {
    return this.summaryService.getLeaderboardBySummonerName(
      region,
      summonerName,
    );
  }
}
