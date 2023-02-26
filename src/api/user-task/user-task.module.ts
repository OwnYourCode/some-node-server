import { Module } from '@nestjs/common';
import { UserTaskController } from './controller/user-task.controller';
import { UserTaskService } from './service/user-task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTaskEntity } from './model/user-task.entity';
import { DIMSLoggerService } from '../../logger/logger.service';
import { TaskStateService } from '../task-state/service/task-state.service';
import { TaskStateEntity } from '../task-state/model/task-state.entity';
import { UserProfileService } from '../user-profile/service/user-profile.service';
import { UserProfileEntity } from '../user-profile/model/user-profile.entity';
import { DirectionService } from '../direction/service/direction.service';
import { DirectionEntity } from '../direction/model/direction.entity';
import { TaskService } from '../task/service/task.service';
import { TaskEntity } from '../task/model/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTaskEntity, TaskStateEntity, TaskEntity, UserProfileEntity, DirectionEntity]),
  ],
  providers: [DIMSLoggerService, UserTaskService, TaskStateService, UserProfileService, DirectionService, TaskService],
  controllers: [UserTaskController],
  exports: [UserTaskService],
})
export class UserTaskModule {}
