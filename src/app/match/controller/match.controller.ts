import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { MatchService } from '../services/match.service';
import { ApiTags } from '@nestjs/swagger';
import { RegionInterceptor } from '../../utils/region.interceptor';

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
  findBySummonerName(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
  ) {
    return this.matchService.findMatchesBySizeLimitAndSummonerName(
      region,
      summonerName,
    );
  }
}
