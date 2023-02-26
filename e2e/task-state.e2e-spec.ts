import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskStateEntity } from '../src/api/task-state/model/task-state.entity';
import { UserProfileEntity } from '../src/api/user-profile/model/user-profile.entity';
import { UserTaskEntity } from '../src/api/user-task/model/user-task.entity';
import { TaskEntity } from '../src/api/task/model/task.entity';
import { TaskTrackEntity } from '../src/api/task-track/model/task-track.entity';
import { RolesGuard } from '../src/shared/guards/roles.guard';
import { Role } from '../src/shared/enums/role.enum';
import { getRepository } from 'typeorm';
import * as request from 'supertest';
import { TaskStateModule } from '../src/api/task-state/task-state.module';
import { taskStatesStub } from '../src/shared/test/stub/states.stub';
import { DirectionEntity } from '../src/api/direction/model/direction.entity';

describe('TaskStateController (e2e)', () => {
  let app: INestApplication;
  let httpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TaskStateModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          password: 'postgres',
          username: 'postgres',
          database: 'DIMSCore-e2e',
          entities: [TaskStateEntity, UserProfileEntity, DirectionEntity, TaskEntity, UserTaskEntity, TaskTrackEntity],
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
    await getRepository(TaskStateEntity).createQueryBuilder().delete().execute();
    await app.close();
  });

  beforeEach(async () => {
    await getRepository(TaskStateEntity).createQueryBuilder().insert().values(taskStatesStub).execute();
  });

  it('/task-states GET', async () => {
    const response = await request(httpServer).get('/task-states');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
  });
});
