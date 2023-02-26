import { Test, TestingModule } from '@nestjs/testing';
import { DIMSLoggerService } from './logger.service';

describe('LoggerService', () => {
  let service: DIMSLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DIMSLoggerService],
    }).compile();

    service = module.get<DIMSLoggerService>(DIMSLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
