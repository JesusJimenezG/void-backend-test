import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { SummaryService } from '../services/summary.service';
import { ApiTags } from '@nestjs/swagger';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RegionInterceptor } from '../../utils/region.interceptor';

@ApiTags('Player Summary')
@Controller('summary')
@UseInterceptors(RegionInterceptor)
export class SummaryController {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly summaryService: SummaryService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('player_summary')
  @Get(':region/:summonerName')
  getSummary(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
  ) {
    return this.summaryService.getSummary(region, summonerName);
  }
}
