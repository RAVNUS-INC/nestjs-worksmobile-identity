import { Test, TestingModule } from '@nestjs/testing';
import { WorksmobileBotService } from './worksmobile-bot.service';

describe('WorksmobileBotService', () => {
  let service: WorksmobileBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorksmobileBotService],
    }).compile();

    service = module.get<WorksmobileBotService>(WorksmobileBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
