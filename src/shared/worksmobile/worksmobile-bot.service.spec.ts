import { Test, TestingModule } from '@nestjs/testing';
import { WorksmobileBotService } from './worksmobile-bot.service';
import { ConfigModule } from '@nestjs/config';
import { WorksmobileTokenService } from './worksmobile-token.service';
import { CacheModule } from '@nestjs/cache-manager';

describe('WorksmobileBotService', () => {
  let service: WorksmobileBotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        CacheModule.register(),
      ],
      providers: [WorksmobileBotService, WorksmobileTokenService],
    }).compile();

    service = module.get<WorksmobileBotService>(WorksmobileBotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendTextMessage()', () => {
    it('텍스트형 메시지 발송 성공', async () => {
      jest.spyOn(service, 'sendTextMessage').mockResolvedValue(true);
      const result = await service.sendTextMessage('test message');
      expect(result).toBe(true);
    });

    it('텍스트형 메시지 발송 실패', async () => {
      jest
        .spyOn(service, 'sendTextMessage')
        .mockRejectedValue(new Error('메시지 전송에 실패했습니다.'));
      await expect(service.sendTextMessage('')).rejects.toThrow();
    });
  });
});
