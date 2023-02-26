import { Test } from '@nestjs/testing';
import { TaskTrackController } from './task-track.controller';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { TaskTrackService } from '../service/task-track.service';

describe('TaskTrackController', () => {
  let controller: TaskTrackController;

  const mockTaskTrackService = jest.fn();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TaskTrackController],
      providers: [
        DIMSLoggerService,
        {
          provide: TaskTrackService,
          useValue: mockTaskTrackService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TaskTrackController>(TaskTrackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
