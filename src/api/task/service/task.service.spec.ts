import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskEntity } from '../model/task.entity';
import { UserTaskService } from '../../user-task/service/user-task.service';
import { DirectionService } from '../../direction/service/direction.service';
import { DIMSLoggerService } from '../../../logger/logger.service';

describe('TaskService', () => {
  let service: TaskService;
  const mockTaskRepository = {};
  const mockUserTaskService = {};
  const mockDirectionService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTaskService,
        DirectionService,
        DIMSLoggerService,
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: mockTaskRepository,
        },
      ],
    })
      .overrideProvider(UserTaskService)
      .useValue(mockUserTaskService)
      .overrideProvider(DirectionService)
      .useValue(mockDirectionService)
      .compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
