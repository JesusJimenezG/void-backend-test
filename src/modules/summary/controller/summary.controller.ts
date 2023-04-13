import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Inject,
  Query,
} from '@nestjs/common';
import { SummaryService } from '../services/summary.service';
import { ApiTags } from '@nestjs/swagger';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RegionInterceptor } from '../../../shared/interceptors/region.interceptor';
import { PageOptionsDto } from '../../../shared/pagination/page-options.dto';

@ApiTags('Player Summary')
@Controller('summary')
@UseInterceptors(RegionInterceptor)
export class SummaryController {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly summaryService: SummaryService,
  ) {}

  @Get(':region/:summonerName/matches')
  @UseInterceptors(CacheInterceptor)
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

  @Get(':region/:summonerName')
  @UseInterceptors(CacheInterceptor)
  getPlayerSummary(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
    @Query('queueId') queueId?: string,
  ) {
    return this.summaryService.getPlayerSummary(region, summonerName, queueId);
  }

  @Get(':region/:summonerName/leaderboard')
  @UseInterceptors(CacheInterceptor)
  getLeaderboard(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
  ) {
    return this.summaryService.getLeaderboard(region, summonerName);
  }
}
