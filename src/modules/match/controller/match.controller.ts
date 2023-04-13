import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { MatchService } from '../services/match.service';
import { ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { RegionInterceptor } from '../../../shared/interceptors/region.interceptor';
import { PageOptionsDto } from '../../../shared/pagination/page-options.dto';

@ApiTags('Player Matches')
@Controller('match')
@UseInterceptors(RegionInterceptor)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get(':region/matches')
  findAll(@Param('region') region: string) {
    return this.matchService.findAll(region);
  }

  @Get(':region/:summonerName')
  @UseInterceptors(CacheInterceptor)
  findRecentSummonerMatches(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
    @Query() pageOptionsDto?: PageOptionsDto,
  ) {
    return this.matchService.findRecentSummonerMatches(
      region,
      summonerName,
      pageOptionsDto,
    );
  }

  @Get(':region/:summonerName/:matchId')
  findMatchBySummonerNameAndMatchId(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
    @Param('matchId') matchId: string,
  ) {
    return this.matchService.findMatchBySummonerNameAndMatchId(
      region,
      summonerName,
      matchId,
    );
  }
}
