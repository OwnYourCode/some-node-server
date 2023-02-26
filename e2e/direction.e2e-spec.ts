import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectionEntity } from '../src/api/direction/model/direction.entity';
import { RolesGuard } from '../src/shared/guards/roles.guard';
import { Role } from '../src/shared/enums/role.enum';
import { getRepository } from 'typeorm';
import { directionsStub2 } from '../src/shared/test/stub/direction.stub';
import { DirectionModule } from '../src/api/direction/direction.module';
import * as request from 'supertest';
import { UserProfileEntity } from '../src/api/user-profile/model/user-profile.entity';
import { UserTaskEntity } from '../src/api/user-task/model/user-task.entity';
import { TaskEntity } from '../src/api/task/model/task.entity';
import { TaskTrackEntity } from '../src/api/task-track/model/task-track.entity';
import { TaskStateEntity } from '../src/api/task-state/model/task-state.entity';

describe('DirectionController (e2e)', () => {
  let app: INestApplication;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        DirectionModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          password: 'postgres',
          username: 'postgres',
          database: 'DIMSCore-e2e',
          entities: [DirectionEntity, TaskStateEntity, UserProfileEntity, UserTaskEntity, TaskEntity, TaskTrackEntity],
        }),
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue([Role.USER, Role.ADMIN, Role.MENTOR])
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await getRepository(DirectionEntity).createQueryBuilder().delete().execute();
    await app.close();
  });

  beforeEach(async () => {
    await getRepository(DirectionEntity).createQueryBuilder().insert().values(directionsStub2).execute();
  });

  it('/directions GET', async () => {
    const response = await request(httpServer).get('/directions');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
  });
});
