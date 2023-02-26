import { Test, TestingModule } from '@nestjs/testing';
import { DirectionService } from './direction.service';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DirectionEntity } from '../model/direction.entity';
import { mockRepository, MockType } from '../../../shared/test/mockRepository';
import { Repository } from 'typeorm';
import { directions } from '../../../shared/test/directions.mock';
import { CreateDirectionDto } from '../dto/create-direction.dto';

describe('DirectionService', () => {
  let directionService: DirectionService;
  let directionRepositoryMock: MockType<Repository<DirectionEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DIMSLoggerService,
        DirectionService,
        {
          provide: getRepositoryToken(DirectionEntity),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    directionService = module.get<DirectionService>(DirectionService);
    directionRepositoryMock = module.get(getRepositoryToken(DirectionEntity));
  });

  it('should be defined', () => {
    expect(directionService).toBeDefined();
  });

  it('should get an array of directions', async () => {
    directionRepositoryMock.find.mockReturnValue(directions);

    const actual = await directionService.getAll();

    expect(actual).toEqual(directions);
  });

  it('should create a new direction', async () => {
    const newDirection: CreateDirectionDto = {
      // cast to any to add new Direction
      name: 'Go' as any,
      description: 'Modern back-end language',
    };

    directionRepositoryMock.save.mockResolvedValue({
      // mocked id
      id: '7a1c8cda-370a-4803-a6d5-d751bde035c8',
      ...newDirection,
    });

    const actual = await directionService.create(newDirection);

    expect(actual).toEqual({ ...newDirection });
  });
});
