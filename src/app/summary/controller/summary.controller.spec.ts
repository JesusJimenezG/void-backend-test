import { Test, TestingModule } from '@nestjs/testing';
import { SummaryController } from '../controller/summary.controller';
import { SummaryService } from '../service/summary.service';

describe('SummaryController', () => {
  let controller: SummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SummaryController],
      providers: [SummaryService],
    }).compile();

    controller = module.get<SummaryController>(SummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
