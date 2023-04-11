import { Inject, Injectable } from '@nestjs/common';
import { SummonerLeagueSummary } from '../entities/summoner-league-summary';
import { REPOSITORIES } from 'src/config/constants';
import { Repository } from 'typeorm';

@Injectable()
export class SummaryService {
  constructor(
    @Inject(REPOSITORIES.SUMMARY)
    private summaryRepository: Repository<SummonerLeagueSummary>,
  ) {}

  getSummary(summonerId: string) {
    const summary = this.summaryRepository.findOne({
      where: {
        summonerId: summonerId,
      },
    });
    console.log('summary: ', summary);
    return 'Sumary';
  }
}
