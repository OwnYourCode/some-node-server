import { Module } from '@nestjs/common';
import { UserProfileService } from './service/user-profile.service';
import { UserProfileController } from './controller/user-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileEntity } from './model/user-profile.entity';
import { DirectionService } from '../direction/service/direction.service';
import { DirectionEntity } from '../direction/model/direction.entity';
import { DIMSLoggerService } from '../../logger/logger.service';
import { UserTaskEntity } from '../user-task/model/user-task.entity';
import { TaskEntity } from '../task/model/task.entity';
import { TaskService } from '../task/service/task.service';
import { UserTaskService } from '../user-task/service/user-task.service';
import { TaskStateEntity } from '../task-state/model/task-state.entity';
import { TaskStateService } from '../task-state/service/task-state.service';
import { TaskTrackService } from '../task-track/service/task-track.service';
import { TaskTrackEntity } from '../task-track/model/task-track.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserProfileEntity,
      DirectionEntity,
      UserTaskEntity,
      TaskEntity,
      TaskStateEntity,
      TaskTrackEntity,
    ]),
  ],
  providers: [
    UserProfileService,
    DirectionService,
    DIMSLoggerService,
    TaskService,
    UserTaskService,
    TaskStateService,
    TaskTrackService,
  ],
  controllers: [UserProfileController],
  exports: [UserProfileService],
})
export class UserProfileModule {}
