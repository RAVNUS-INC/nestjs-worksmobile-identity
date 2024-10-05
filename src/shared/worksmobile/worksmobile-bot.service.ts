import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { generateBotsUsersMessages } from './constants/endpoint.constant';
import { ConfigService } from '@nestjs/config';
import { WorksmobileTokenService } from './worksmobile-token.service';

@Injectable()
export class WorksmobileBotService {
  constructor(
    private readonly config: ConfigService,
    private readonly worksmobileTokenService: WorksmobileTokenService,
  ) {}

  async sendTextMessage(text: string): Promise<boolean> {
    const botId = this.config.get('NAVER_WORKS_BOT_ID');
    const testUserId = this.config.get('RAVNUS_TEST_USER_ID');
    const token = await this.worksmobileTokenService.getToken();

    try {
      await axios.post(
        generateBotsUsersMessages(botId, testUserId),
        {
          content: {
            type: 'text',
            text,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return true;
    } catch (e) {
      throw new Error(
        `메시지 전송에 실패했습니다. (${e.response.data?.message || e.response.data?.description})`,
      );
    }
  }
}
