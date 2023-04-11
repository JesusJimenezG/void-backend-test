import { Module } from '@nestjs/common';
import { SummaryService } from './service/summary.service';
import { SummaryController } from './controller/summary.controller';
import { DatabaseModule } from 'src/database/database.module';
import { summaryProviders } from './provider/summary.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [SummaryController],
  providers: [...summaryProviders, SummaryService],
})
export class SummaryModule {}
