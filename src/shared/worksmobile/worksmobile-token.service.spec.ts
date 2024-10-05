import { Test, TestingModule } from '@nestjs/testing';
import { WorksmobileTokenService } from './worksmobile-token.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

describe('WorksmobileTokenService', () => {
  let service: WorksmobileTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        CacheModule.register(),
      ],
      providers: [WorksmobileTokenService],
    }).compile();

    service = module.get<WorksmobileTokenService>(WorksmobileTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('인증', () => {
    it('JWT Payload 검증', async () => {
      const now = Math.floor(new Date().getTime() / 1000);
      const allowRange = 5000; // 오차 범위는 5초로 설정

      const payload = await service.generateJwtPayload();

      expect(payload.iss).toBeDefined();
      expect(payload.sub).toBeDefined();

      // iat, exp 는 테스트 돌리면서 시간 오차 범위 5초 허용
      expect(payload.iat).toBeGreaterThanOrEqual(now - allowRange);
      expect(payload.iat).toBeLessThanOrEqual(now + allowRange);

      const oneHourLater = now + 60 * 60;
      expect(payload.exp).toBeGreaterThanOrEqual(oneHourLater - allowRange);
      expect(payload.exp).toBeLessThanOrEqual(oneHourLater + allowRange);
    });

    it('JWT 토큰 발급', async () => {
      const token = await service.generateJwtToken();

      // jwt 는 header.payload.signature 형태
      const [header, payload, signature] = token.split('.');
      expect(header).toBeDefined();
      expect(payload).toBeDefined();
      expect(signature).toBeDefined();

      const decodedPayload = JSON.parse(
        Buffer.from(payload, 'base64').toString(),
      );
      expect(decodedPayload.iss).toBeDefined();
      expect(decodedPayload.sub).toBeDefined();
      expect(decodedPayload.iat).toBeDefined();
    });

    it('토큰 요청', async () => {
      const token = await service.requestToken();

      expect(token).toHaveProperty('accessToken');
      expect(token).toHaveProperty('refreshToken');
      expect(token).toHaveProperty('scope');
      expect(token).toHaveProperty('tokenType', 'Bearer');
      expect(token).toHaveProperty('expiresIn', '86400');
    });
  });
});
