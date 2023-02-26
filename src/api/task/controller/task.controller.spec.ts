import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { TaskService } from '../service/task.service';
import { UserTaskService } from '../../user-task/service/user-task.service';
import { TaskStateService } from '../../task-state/service/task-state.service';
import { UserProfileService } from '../../user-profile/service/user-profile.service';
import { DirectionService } from '../../direction/service/direction.service';

describe('TaskController', () => {
  let taskController: TaskController;

  const mockTaskService = {};
  const mockUserTaskService = {};
  const mockDirectionService = {};
  const mockTaskStateService = {};
  const mockUserProfileService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        DIMSLoggerService,
        TaskService,
        UserTaskService,
        TaskStateService,
        UserProfileService,
        DirectionService,
      ],
    })
      .overrideProvider(TaskService)
      .useValue(mockTaskService)
      .overrideProvider(UserTaskService)
      .useValue(mockUserTaskService)
      .overrideProvider(TaskStateService)
      .useValue(mockTaskStateService)
      .overrideProvider(UserProfileService)
      .useValue(mockUserProfileService)
      .overrideProvider(DirectionService)
      .useValue(mockDirectionService)
      .compile();

    taskController = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });
});
