import { Module } from '@nestjs/common';
import { WorksmobileTokenService } from './worksmobile-token.service';
import { CacheModule } from '@nestjs/cache-manager';
import { WorksmobileAttendanceService } from './worksmobile-attendance.service';
import { WorksmobileBotService } from './worksmobile-bot.service';

@Module({
  imports: [CacheModule.register()],
  providers: [
    WorksmobileTokenService,
    WorksmobileAttendanceService,
    WorksmobileBotService,
  ],
  exports: [WorksmobileAttendanceService, WorksmobileBotService],
})
export class WorksmobileModule {}
