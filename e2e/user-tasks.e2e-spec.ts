import { INestApplication } from '@nestjs/common';
import { TaskService } from '../src/api/task/service/task.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileEntity } from '../src/api/user-profile/model/user-profile.entity';
import { DirectionEntity } from '../src/api/direction/model/direction.entity';
import { UserTaskEntity } from '../src/api/user-task/model/user-task.entity';
import { TaskTrackEntity } from '../src/api/task-track/model/task-track.entity';
import { TaskEntity } from '../src/api/task/model/task.entity';
import { TaskStateEntity } from '../src/api/task-state/model/task-state.entity';
import { RolesGuard } from '../src/shared/guards/roles.guard';
import { Role } from '../src/shared/enums/role.enum';
import { getRepository } from 'typeorm';
import { createUserProfilesStub } from '../src/shared/test/stub/userProfiles.stub';
import { directionsStub } from '../src/shared/test/stub/direction.stub';
import { taskStatesStub } from '../src/shared/test/stub/states.stub';
import { tasksStub } from '../src/shared/test/stub/tasks.stub';
import { UserTaskModule } from '../src/api/user-task/user-task.module';
import { UserTaskService } from '../src/api/user-task/service/user-task.service';
import { UserTaskRequestDto } from '../src/api/user-task/dto/user-task.request.dto';
import * as request from 'supertest';

describe('UserTaskController (e2e)', () => {
  let app: INestApplication;
  let taskService: TaskService;
  let userTaskService: UserTaskService;
  let httpServer;
  let users: UserProfileEntity[];
  let tasks: TaskEntity[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserTaskModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          password: 'postgres',
          username: 'postgres',
          database: 'DIMSCore-e2e',
          entities: [UserProfileEntity, DirectionEntity, UserTaskEntity, TaskTrackEntity, TaskEntity, TaskStateEntity],
        }),
      ],
    })
      .overrideGuard(RolesGuard)
      .useValue([Role.USER, Role.ADMIN, Role.MENTOR])
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    httpServer = app.getHttpServer();
    userTaskService = moduleFixture.get<UserTaskService>(UserTaskService);
    taskService = moduleFixture.get<TaskService>(TaskService);

    await getRepository(UserProfileEntity).createQueryBuilder().insert().values(createUserProfilesStub).execute();
    await getRepository(DirectionEntity).createQueryBuilder().insert().values(directionsStub).execute();
    await getRepository(TaskStateEntity).createQueryBuilder().insert().values(taskStatesStub).execute();
  });

  afterAll(async () => {
    await getRepository(UserProfileEntity).createQueryBuilder().delete().execute();
    await getRepository(DirectionEntity).createQueryBuilder().delete().execute();
    await getRepository(TaskStateEntity).createQueryBuilder().delete().execute();
    await getRepository(TaskEntity).createQueryBuilder().delete().execute();
    await getRepository(UserTaskEntity).createQueryBuilder().delete().execute();
    await app.close();
  });

  beforeEach(async () => {
    await getRepository(TaskEntity).createQueryBuilder().delete().execute();
    await getRepository(UserTaskEntity).createQueryBuilder().delete().execute();

    users = await getRepository(UserProfileEntity).createQueryBuilder().select().getMany();

    tasksStub[0].assignedUsers = [users[0].id, users[1].id];
    tasksStub[1].assignedUsers = [users[0].id];
    tasksStub[2].assignedUsers = [users[1].id, users[2].id];
    tasksStub[3].assignedUsers = [users[1].id, users[2].id, users[3].id];

    await taskService.create(tasksStub[0]);
    await taskService.create(tasksStub[1]);
    await taskService.create(tasksStub[2]);
    await taskService.create(tasksStub[3]);

    tasks = await getRepository(TaskEntity).createQueryBuilder().select().getMany();
  });

  it('users/:id/user-tasks (GET)', async () => {
    const firstUserId = users[0].id;
    const response = await request(httpServer).get(`/users/${firstUserId}/user-tasks`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toEqual({
      id: expect.any(String),
      name: 'Create table <UserProfile>',
      description: 'Create table UserProfile in database with fields: firstName, lastName',
      deadlineDate: '2021-08-25',
      startDate: '2021-08-22',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('users/:id/user-tasks/:userTaskId (GET)', async () => {
    const firstUserId = users[0].id;
    const userTaskId = (await userTaskService.getAll(firstUserId))[0].id;

    const response = await request(httpServer).get(`/users/${firstUserId}/user-tasks/${userTaskId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'Create table <UserProfile>',
      description: 'Create table UserProfile in database with fields: firstName, lastName',
      deadlineDate: '2021-08-25',
      startDate: '2021-08-22',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('users/:id/user-tasks (POST)', async () => {
    const firstUserId = users[0].id;
    const firstTaskId = tasks[0].id;

    const createUserTaskDto: UserTaskRequestDto = {
      taskId: firstTaskId,
      userId: firstUserId,
    };

    const response = await request(httpServer).post(`/users/${firstUserId}/user-tasks`).send(createUserTaskDto);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      stateId: expect.any(String),
      taskId: firstTaskId,
      userId: firstUserId,
      taskTrackId: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('users/:id/user-tasks/:userTaskId (DELETE) ', async () => {
    const firstUserId = users[0].id;

    const userTaskId = (await userTaskService.getAll(firstUserId))[0].id;

    const response = await request(httpServer).delete(`/users/${firstUserId}/user-tasks/${userTaskId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ affected: 1 });
  });
});
