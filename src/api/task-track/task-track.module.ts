import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTrackEntity } from './model/task-track.entity';
import { TaskTrackController } from './controller/task-track.controller';
import { TaskTrackService } from './service/task-track.service';
import { UserTaskEntity } from '../user-task/model/user-task.entity';
import { DIMSLoggerService } from '../../logger/logger.service';
import { TaskEntity } from '../task/model/task.entity';
import { UserTaskService } from '../user-task/service/user-task.service';
import { TaskStateService } from '../task-state/service/task-state.service';
import { UserProfileService } from '../user-profile/service/user-profile.service';
import { TaskStateEntity } from '../task-state/model/task-state.entity';
import { UserProfileEntity } from '../user-profile/model/user-profile.entity';
import { DirectionService } from '../direction/service/direction.service';
import { DirectionEntity } from '../direction/model/direction.entity';
import { TaskService } from '../task/service/task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskTrackEntity,
      UserTaskEntity,
      TaskEntity,
      TaskStateEntity,
      UserProfileEntity,
      DirectionEntity,
    ]),
  ],
  providers: [
    TaskTrackService,
    DIMSLoggerService,
    UserTaskService,
    TaskStateService,
    UserProfileService,
    DirectionService,
    TaskService,
  ],
  controllers: [TaskTrackController],
  exports: [TaskTrackService],
})
export class TaskTrackModule {}
