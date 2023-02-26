import { AppController } from './app.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('AppController', () => {
  let appController: AppController;

  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    appController = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should be pinged', () => {
    expect(appController.getPing()).toBe('ping!');
  });

  it('should / GET ping!', () => {
    return request(app.getHttpServer()).get('/ping').expect(200).expect('ping!');
  });

  afterAll(async () => {
    await app.close();
  });
});
