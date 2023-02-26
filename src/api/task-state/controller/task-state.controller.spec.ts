import { Test } from '@nestjs/testing';
import { TaskStateController } from './task-state.controller';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { TaskStateService } from '../service/task-state.service';

describe('TaskStateController', () => {
  let controller: TaskStateController;
  let taskStateService: TaskStateService;

  const mockTaskStateService = jest.fn();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TaskStateController],
      providers: [
        DIMSLoggerService,
        {
          provide: TaskStateService,
          useValue: mockTaskStateService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TaskStateController>(TaskStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
