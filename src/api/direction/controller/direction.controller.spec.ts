import { Test, TestingModule } from '@nestjs/testing';
import { DirectionController } from './direction.controller';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { DirectionService } from '../service/direction.service';
import { INestApplication } from '@nestjs/common';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { CreateDirectionDto } from '../dto/create-direction.dto';
import { directions } from '../../../shared/test/directions.mock';
import * as request from 'supertest';

describe('DirectionController', () => {
  let directionController: DirectionController;
  let directionService: DirectionService;

  let app: INestApplication;
  let module: TestingModule;

  const mockDirectionService = {
    getAll: jest.fn().mockReturnValue(directions),
    create: jest.fn().mockImplementation((direction: CreateDirectionDto) => {
      return Promise.resolve({ ...direction });
    }),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [DirectionController],
      providers: [
        DIMSLoggerService,
        {
          provide: DirectionService,
          useValue: mockDirectionService,
        },
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    directionService = module.get<DirectionService>(DirectionService);
    directionController = module.get<DirectionController>(DirectionController);
  });

  it('should be defined', () => {
    expect(directionController).toBeDefined();
  });

  it('should get an array of directions', () => {
    expect(directionController.getDirections()).resolves.toEqual(directions);
  });

  it('should create a new direction', () => {
    const newDirection: CreateDirectionDto = {
      // cast to any to add new Direction
      name: 'Go' as any,
      description: 'Modern back-end language',
    };
    expect(directionController.create(newDirection)).resolves.toEqual({
      ...newDirection,
    });
  });

  it('should delete direction by id', () => {
    expect(directionController.delete(1)).resolves.toBeUndefined();
  });

  it('should / GET directions', () => {
    const directions = directionService.getAll();

    return request(app.getHttpServer()).get('/directions').expect(200).expect(directions);
  });

  afterAll(async () => {
    await app.close();
  });
});
