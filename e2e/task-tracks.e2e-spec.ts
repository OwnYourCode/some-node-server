import { INestApplication } from '@nestjs/common';
import { TaskService } from '../src/api/task/service/task.service';
import { UserTaskService } from '../src/api/user-task/service/user-task.service';
import { UserProfileEntity } from '../src/api/user-profile/model/user-profile.entity';
import { TaskEntity } from '../src/api/task/model/task.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectionEntity } from '../src/api/direction/model/direction.entity';
import { UserTaskEntity } from '../src/api/user-task/model/user-task.entity';
import { TaskTrackEntity } from '../src/api/task-track/model/task-track.entity';
import { TaskStateEntity } from '../src/api/task-state/model/task-state.entity';
import { RolesGuard } from '../src/shared/guards/roles.guard';
import { Role } from '../src/shared/enums/role.enum';
import { getRepository } from 'typeorm';
import { createUserProfilesStub } from '../src/shared/test/stub/userProfiles.stub';
import { directionsStub } from '../src/shared/test/stub/direction.stub';
import { taskStatesStub } from '../src/shared/test/stub/states.stub';
import { tasksStub } from '../src/shared/test/stub/tasks.stub';
import * as request from 'supertest';
import { TaskTrackRequestDto } from '../src/api/task-track/dto/task-track.request.dto';
import { TaskTrackModule } from '../src/api/task-track/task-track.module';
import { TaskTrackService } from '../src/api/task-track/service/task-track.service';

describe('TaskTrackController (e2e)', () => {
  let app: INestApplication;
  let taskService: TaskService;
  let userTaskService: UserTaskService;
  let taskTrackService: TaskTrackService;
  let httpServer;
  let users: UserProfileEntity[];
  let tasks: TaskEntity[];
  let firstUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TaskTrackModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          password: 'postgres',
          username: 'postgres',
          database: 'DIMSCore-e2e',
          entities: [TaskTrackEntity, UserTaskEntity, TaskEntity, UserProfileEntity, DirectionEntity, TaskStateEntity],
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
    taskTrackService = moduleFixture.get<TaskTrackService>(TaskTrackService);

    await getRepository(DirectionEntity).createQueryBuilder().insert().values(directionsStub).execute();
    await getRepository(TaskStateEntity).createQueryBuilder().insert().values(taskStatesStub).execute();
    await getRepository(UserProfileEntity).createQueryBuilder().insert().values(createUserProfilesStub).execute();

    users = await getRepository(UserProfileEntity).createQueryBuilder().select().getMany();
    firstUserId = users[0].id;
  });

  afterAll(async () => {
    await getRepository(UserProfileEntity).createQueryBuilder().delete().execute();
    await getRepository(DirectionEntity).createQueryBuilder().delete().execute();
    await getRepository(TaskStateEntity).createQueryBuilder().delete().execute();
    await getRepository(TaskEntity).createQueryBuilder().delete().execute();
    await getRepository(UserTaskEntity).createQueryBuilder().delete().execute();
    await getRepository(TaskTrackEntity).createQueryBuilder().delete().execute();
    await app.close();
  });

  beforeEach(async () => {
    await getRepository(TaskEntity).createQueryBuilder().delete().execute();
    await getRepository(UserTaskEntity).createQueryBuilder().delete().execute();
    await getRepository(TaskTrackEntity).createQueryBuilder().delete().execute();

    tasksStub[0].assignedUsers = [users[0].id, users[1].id];
    tasksStub[1].assignedUsers = [users[0].id];
    tasksStub[2].assignedUsers = [users[1].id, users[2].id];
    tasksStub[3].assignedUsers = [users[1].id, users[2].id, users[3].id];

    await taskService.create(tasksStub[0]);
    await taskService.create(tasksStub[1]);
    await taskService.create(tasksStub[2]);
    await taskService.create(tasksStub[3]);

    tasks = await getRepository(TaskEntity).createQueryBuilder().select().getMany();

    await userTaskService.create({
      userId: users[0].id,
      taskId: tasks[0].id,
    });
    await userTaskService.create({
      userId: users[0].id,
      taskId: tasks[1].id,
    });
    await userTaskService.create({
      userId: users[0].id,
      taskId: tasks[2].id,
    });
    await userTaskService.create({
      userId: users[1].id,
      taskId: tasks[1].id,
    });
    await userTaskService.create({
      userId: users[1].id,
      taskId: tasks[2].id,
    });
  });

  it('/users/:userId/user-tasks/:userTaskId/tracks (GET)', async () => {
    const userTaskId = (await userTaskService.getAll(firstUserId))[0].id;

    const createTaskTracksDto1: TaskTrackRequestDto = {
      date: '2020-12-30',
      note: 'Delete id from table <UserProfile>',
    };

    const createTaskTracksDto2: TaskTrackRequestDto = {
      date: '2021-01-16',
      note: 'Delete Name from table <UserProfile>',
    };

    await taskTrackService.create(userTaskId, createTaskTracksDto1);
    await taskTrackService.create(userTaskId, createTaskTracksDto2);

    const response = await request(httpServer).get(`/users/${firstUserId}/user-tasks/${userTaskId}/tracks`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('/users/:userId/user-tasks/:userTaskId/tracks/:taskTrackId (GET)', async () => {
    const userTaskId = (await userTaskService.getAll(firstUserId))[0].id;

    const createTaskTracksDto1: TaskTrackRequestDto = {
      date: '2020-12-30',
      note: 'Delete id from table <UserProfile>',
    };

    const createTaskTracksDto2: TaskTrackRequestDto = {
      date: '2021-01-16',
      note: 'Delete Name from table <UserProfile>',
    };

    await taskTrackService.create(userTaskId, createTaskTracksDto1);
    await taskTrackService.create(userTaskId, createTaskTracksDto2);

    const taskTrackId = (await taskTrackService.getAll(firstUserId, userTaskId))[0].id;

    const response = await request(httpServer).get(
      `/users/${firstUserId}/user-tasks/${userTaskId}/tracks/${taskTrackId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      date: '2020-12-30',
      note: 'Delete id from table <UserProfile>',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userTaskId: expect.any(String),
    });
  });

  it('/users/:userId/user-tasks/:userTaskId/tracks (POST)', async () => {
    const userTaskId = (await userTaskService.getAll(firstUserId))[0].id;

    const createTaskTracksDto: TaskTrackRequestDto = {
      date: '2020-12-30',
      note: 'Delete Id from table',
    };

    const response = await request(httpServer)
      .post(`/users/${firstUserId}/user-tasks/${userTaskId}/tracks`)
      .send(createTaskTracksDto);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      date: '2020-12-30',
      note: 'Delete Id from table',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userTaskId: expect.any(String),
    });
  });

  it('/users/:id/user-tasks/:userTaskId/task-tracks/:taskTrackId (PUT)', async () => {
    const userTaskId = (await userTaskService.getAll(firstUserId))[0].id;

    const createTaskTracksDto1: TaskTrackRequestDto = {
      date: '2020-12-30',
      note: 'Delete id from table <UserProfile>',
    };

    const createTaskTracksDto2: TaskTrackRequestDto = {
      date: '2021-01-16',
      note: 'Delete Name from table <UserProfile>',
    };

    await taskTrackService.create(userTaskId, createTaskTracksDto1);
    await taskTrackService.create(userTaskId, createTaskTracksDto2);

    const taskTrackId = (await taskTrackService.getAll(firstUserId, userTaskId))[0].id;

    const updateTaskTracksDto: TaskTrackRequestDto = {
      date: '2021-03-02',
      note: 'Delete Id, firstName from table',
    };

    const response = await request(httpServer)
      .put(`/users/${firstUserId}/user-tasks/${userTaskId}/tracks/${taskTrackId}/`)
      .send(updateTaskTracksDto);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      date: '2021-03-02',
      note: 'Delete Id, firstName from table',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      userTaskId: expect.any(String),
    });
  });

  it('/users/:id/user-tasks/:userTaskId/task-tracks/:taskTrackId (DELETE)', async () => {
    const userTaskId = (await userTaskService.getAll(firstUserId))[0].id;

    const createTaskTracksDto1: TaskTrackRequestDto = {
      date: '2020-12-30',
      note: 'Delete id from table <UserProfile>',
    };

    const createTaskTracksDto2: TaskTrackRequestDto = {
      date: '2021-01-16',
      note: 'Delete Name from table <UserProfile>',
    };

    await taskTrackService.create(userTaskId, createTaskTracksDto1);
    await taskTrackService.create(userTaskId, createTaskTracksDto2);

    const taskTrackId = (await taskTrackService.getAll(firstUserId, userTaskId))[0].id;

    const response = await request(httpServer).delete(
      `/users/${firstUserId}/user-tasks/${userTaskId}/tracks/${taskTrackId}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      affected: 1,
    });
  });
});
