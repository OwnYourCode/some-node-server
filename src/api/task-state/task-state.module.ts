import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskStateEntity } from './model/task-state.entity';
import { TaskStateController } from './controller/task-state.controller';
import { TaskStateService } from './service/task-state.service';
import { DIMSLoggerService } from '../../logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskStateEntity])],
  controllers: [TaskStateController],
  providers: [TaskStateService, DIMSLoggerService],
  exports: [TaskStateService],
})
export class TaskStateModule {}
