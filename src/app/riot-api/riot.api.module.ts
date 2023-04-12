import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RiotAPIService } from './riot.api.service';

@Module({
  imports: [HttpModule],
  providers: [RiotAPIService],
  exports: [RiotAPIService],
})
export class RiotAPIModule {}
