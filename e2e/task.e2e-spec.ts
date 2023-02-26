import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskModule } from '../src/api/task/task.module';
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
import { directionsStub } from '../src/shared/test/stub/direction.stub';
import { createUserProfilesStub } from '../src/shared/test/stub/userProfiles.stub';
import { createTaskDto1, tasksStub } from '../src/shared/test/stub/tasks.stub';
import { taskStatesStub } from '../src/shared/test/stub/states.stub';
import * as request from 'supertest';
import { TaskResponseDto } from '../src/api/task/dto/task.response.dto';
import { TaskService } from '../src/api/task/service/task.service';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let taskService: TaskService;
  let httpServer;
  let fakeTasks;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TaskModule,
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
    taskService = moduleFixture.get<TaskService>(TaskService);

    await getRepository(UserProfileEntity).createQueryBuilder().insert().values(createUserProfilesStub).execute();
    await getRepository(DirectionEntity).createQueryBuilder().insert().values(directionsStub).execute();
    await getRepository(TaskStateEntity).createQueryBuilder().insert().values(taskStatesStub).execute();
  });

  afterAll(async () => {
    await getRepository(DirectionEntity).createQueryBuilder().delete().execute();
    await getRepository(TaskStateEntity).createQueryBuilder().delete().execute();
    await getRepository(UserProfileEntity).createQueryBuilder().delete().execute();
    await getRepository(TaskEntity).createQueryBuilder().delete().execute();
    await getRepository(UserTaskEntity).createQueryBuilder().delete().execute();
    await app.close();
  });

  beforeEach(async () => {
    fakeTasks = [...tasksStub];

    await getRepository(TaskEntity).createQueryBuilder().select().delete().execute();
    await getRepository(UserTaskEntity).createQueryBuilder().select().delete().execute();

    const users = await getRepository(UserProfileEntity).createQueryBuilder().select().getMany();

    fakeTasks[0].assignedUsers = [users[0].id, users[1].id];
    fakeTasks[1].assignedUsers = [users[0].id];
    fakeTasks[2].assignedUsers = [users[1].id, users[2].id];
    fakeTasks[3].assignedUsers = [users[1].id, users[2].id, users[3].id];
  });

  it('/tasks (GET) ', async () => {
    await taskService.create(fakeTasks[0]);
    await taskService.create(fakeTasks[1]);
    await taskService.create(fakeTasks[2]);
    await taskService.create(fakeTasks[3]);

    const response = await request(httpServer).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
    expect(response.body[0]).toEqual({
      id: expect.any(String),
      name: 'Create table <UserProfile>',
      description: 'Create table UserProfile in database with fields: firstName, lastName',
      startDate: '2021-08-22',
      deadlineDate: '2021-08-25',
      assignedUsers: [expect.any(String), expect.any(String)],
    });
    expect(response.body[3]).toEqual({
      id: expect.any(String),
      name: 'Create table <TaskState>',
      description: 'Create table TaskState in database with fields: id, state, description',
      startDate: '2021-09-05',
      deadlineDate: '2021-09-22',
      assignedUsers: [expect.any(String), expect.any(String), expect.any(String)],
    });
  });

  it('/tasks (POST) without assigned users', async () => {
    const createTaskDto: TaskResponseDto = {
      name: 'Create table <MemberSize>',
      description: 'Create table MemberSize in database with fields: firstName, lastName',
      deadlineDate: '2022-04-25',
      startDate: '2022-01-22',
      createdAt: '2022-01-22',
      updatedAt: '2022-01-22',
    };

    const response = await request(httpServer).post('/tasks').send(createTaskDto);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'Create table <MemberSize>',
      description: 'Create table MemberSize in database with fields: firstName, lastName',
      deadlineDate: '2022-04-25',
      startDate: '2022-01-22',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/tasks (POST) with assigned users', async () => {
    const createTaskDto: TaskResponseDto = {
      name: 'Create table <MemberSize>',
      description: 'Create table MemberSize in database with fields: firstName, lastName',
      deadlineDate: '2022-04-25',
      startDate: '2022-01-22',
      createdAt: '2022-01-22',
      updatedAt: '2022-01-22',
    };

    const users = await getRepository(UserProfileEntity).createQueryBuilder().select().getMany();

    createTaskDto.assignedUsers = [users[0].id, users[1].id];

    const response = await request(httpServer).post('/tasks').send(createTaskDto);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'Create table <MemberSize>',
      description: 'Create table MemberSize in database with fields: firstName, lastName',
      deadlineDate: '2022-04-25',
      startDate: '2022-01-22',
      assignedUsers: [expect.any(String), expect.any(String)],
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/tasks/:id (PATCH)', async () => {
    const task = await taskService.create(createTaskDto1);

    const response = await request(httpServer).patch(`/tasks/${task.id}`).send({
      description: 'Go go go',
    });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe('Go go go');
    expect(response.body.name).toBe('Create table <UserProfile>');
  });

  it('tasks/:id (GET) task', async () => {
    const task = await taskService.create(createTaskDto1);

    const response = await request(httpServer).get(`/tasks/${task.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'Create table <UserProfile>',
      description: 'Create table UserProfile in database with fields: firstName, lastName',
      deadlineDate: '2021-08-25',
      startDate: '2021-08-22',
      assignedUsers: [expect.any(String), expect.any(String)],
    });
  });

  it('/tasks/:id (DELETE) task', async () => {
    const task = await taskService.create(createTaskDto1);

    const response = await request(httpServer).delete(`/tasks/${task.id}`);

    expect(response.status).toBe(200);
    expect(response.body.affected).toBe(1);
  });
});
