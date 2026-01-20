import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { MatchService } from '../services/match.service';
import { ApiTags } from '@nestjs/swagger';
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

  @Get(':region/:gameName/:tagLine')
  findRecentSummonerMatches(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
    @Query() pageOptionsDto?: PageOptionsDto,
  ) {
    return this.matchService.findRecentSummonerMatches(
      region,
      gameName,
      tagLine,
      pageOptionsDto,
    );
  }

  @Get(':region/:gameName/:tagLine/:matchId')
  findMatchBySummonerNameAndMatchId(
    @Param('region') region: string,
    @Param('gameName') gameName: string,
    @Param('tagLine') tagLine: string,
    @Param('matchId') matchId: string,
  ) {
    return this.matchService.findMatchByRiotIdAndMatchId(
      region,
      gameName,
      tagLine,
      matchId,
    );
  }
}
