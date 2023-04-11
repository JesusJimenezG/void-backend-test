import { Controller, Get, Param } from '@nestjs/common';
import { SummaryService } from '../service/summary.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Player Summary')
@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get(':summonerId')
  getSummary(@Param('summonerId') summonerId: string) {
    return this.summaryService.getSummary(summonerId);
  }
}
