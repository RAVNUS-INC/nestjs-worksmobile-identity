import { Module } from '@nestjs/common';
import { WorksmobileTokenService } from './worksmobile-token.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [CacheModule.register()],
  providers: [WorksmobileTokenService],
  exports: [WorksmobileTokenService],
})
export class WorksmobileModule {}
