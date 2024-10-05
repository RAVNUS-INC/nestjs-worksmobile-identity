import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Endpoint } from './constants/endpoint.constant';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { WorksmobileTokenInterface } from './interfaces/worksmobile-token.interface';
import { CACHE_MANAGER } from '@nestjs/common/cache';

/**
 * 토큰 발급 - https://developers.worksmobile.com/kr/docs/auth-jwt
 */
@Injectable()
export class WorksmobileTokenService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager,
    private readonly config: ConfigService,
  ) {}

  /**
   * JWT 토큰 생성하는 메서드
   */
  async generateJwtToken(): Promise<string> {
    const payload = await this.generateJwtPayload();

    const signOptions: SignOptions = {
      header: {
        alg: 'RS256',
        typ: 'JWT',
      },
      algorithm: 'RS256',
    };

    const privateKey = this.config.get('NAVER_WORKS_PRIVATE_KEY');

    try {
      return jwt.sign(payload, privateKey, signOptions);
    } catch (e) {
      console.error(e);
      throw new Error('JWT 토큰 생성에 실패');
    }
  }

  /**
   * JWT 토큰 페이로드 생성하는 메서드
   */
  async generateJwtPayload() {
    const now = Math.floor(new Date().getTime() / 1000);
    return {
      iss: this.config.get('NAVER_WORKS_CLIENT_ID'),
      sub: this.config.get('NAVER_WORKS_SERVICE_ID'),
      iat: now,
      exp: now + 60 * 60, // 현재 시간으로 부터 1시간
    };
  }

  async requestToken() {
    const token = await this.generateJwtToken();
    return await axios
      .post(
        `${Endpoint.AUTH}`,
        {
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: token,
          client_id: this.config.get('NAVER_WORKS_CLIENT_ID'),
          client_secret: this.config.get('NAVER_WORKS_SECRET_ID'),
          scope: 'contact.read,directory.read',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      // return 은 하고 캐싱 처리
      .then(async (res): Promise<WorksmobileTokenInterface> => {
        const payload = {
          accessToken: res.data.access_token,
          refreshToken: res.data.refresh_token,
          scope: res.data.scope,
          tokenType: res.data.token_type,
          expiresIn: res.data.expires_in,
        };

        await this.cacheManager.set(
          'worksmobile-token',
          JSON.stringify(payload),
          payload.expiresIn * 1000,
        );

        return payload;
      })
      .catch((err) => err.response.data);
  }

  async getToken(): Promise<string> {
    const redisToken = await this.cacheManager.get('worksmobile-token');
    if (redisToken) {
      return JSON.parse(redisToken).accessToken;
    }

    const token = await this.requestToken();
    return token.accessToken;
  }
}
