import { Controller, Get, Param } from '@nestjs/common';
import { SummaryService } from '../service/summary.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Player Summary')
@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get(':region/:summonerName')
  getSummary(
    @Param('region') region: string,
    @Param('summonerName') summonerName: string,
  ) {
    return this.summaryService.getSummary(region, summonerName);
  }
}
