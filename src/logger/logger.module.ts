import { Module } from '@nestjs/common';
import { DIMSLoggerService } from './logger.service';

@Module({
  providers: [DIMSLoggerService],
  exports: [DIMSLoggerService],
})
export class LoggerModule {}
