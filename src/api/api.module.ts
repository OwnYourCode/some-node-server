import { Module } from '@nestjs/common';
import { UserTaskModule } from './user-task/user-task.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { TaskTrackModule } from './task-track/task-track.module';
import { TaskStateModule } from './task-state/task-state.module';
import { TaskModule } from './task/task.module';
import { DirectionModule } from './direction/direction.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/auth.guard';
import { DIMSLoggerService } from '../logger/logger.service';

@Module({
  imports: [
    UserTaskModule,
    UserProfileModule,
    TaskTrackModule,
    TaskStateModule,
    TaskModule,
    DirectionModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    DIMSLoggerService,
  ],
})
export class ApiModule {}
