import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './model/task.entity';
import { DIMSLoggerService } from '../../logger/logger.service';
import { TaskController } from './controller/task.controller';
import { TaskService } from './service/task.service';
import { UserTaskEntity } from '../user-task/model/user-task.entity';
import { UserTaskService } from '../user-task/service/user-task.service';
import { TaskStateService } from '../task-state/service/task-state.service';
import { TaskStateEntity } from '../task-state/model/task-state.entity';
import { UserProfileService } from '../user-profile/service/user-profile.service';
import { UserProfileEntity } from '../user-profile/model/user-profile.entity';
import { DirectionService } from '../direction/service/direction.service';
import { DirectionEntity } from '../direction/model/direction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, UserTaskEntity, TaskStateEntity, UserProfileEntity, DirectionEntity]),
  ],
  providers: [TaskService, DIMSLoggerService, UserTaskService, TaskStateService, UserProfileService, DirectionService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
