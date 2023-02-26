import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserProfileModule } from '../src/api/user-profile/user-profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfileEntity } from '../src/api/user-profile/model/user-profile.entity';
import { UserTaskEntity } from '../src/api/user-task/model/user-task.entity';
import { UserProfileResponse, UserProfileService } from '../src/api/user-profile/service/user-profile.service';
import { DirectionEntity } from '../src/api/direction/model/direction.entity';
import { TaskTrackEntity } from '../src/api/task-track/model/task-track.entity';
import { TaskEntity } from '../src/api/task/model/task.entity';
import { TaskStateEntity } from '../src/api/task-state/model/task-state.entity';
import { DirectionType } from '../src/api/direction/model/direction.enum';
import { Role } from '../src/shared/enums/role.enum';
import { getRepository } from 'typeorm';
import { RolesGuard } from '../src/shared/guards/roles.guard';
import { UserProfileRequestDto } from '../src/api/user-profile/dto/user-profile.request.dto';
import { UserProfileDto } from '../src/api/user-profile/dto/user-profile.dto';
import { directionsStub } from '../src/shared/test/stub/direction.stub';
import { createUserProfileDto_1, createUserProfileDto_2 } from '../src/shared/test/stub/userProfiles.stub';
import * as request from 'supertest';
import { Gender } from '../src/shared/enums/gender.enum';
import { TaskService } from '../src/api/task/service/task.service';
import { createTaskDto1, createTaskDto2 } from '../src/shared/test/stub/tasks.stub';
import { UserTaskService } from '../src/api/user-task/service/user-task.service';
import { taskStatesStub } from '../src/shared/test/stub/states.stub';
import { TaskTrackService } from '../src/api/task-track/service/task-track.service';
import { TaskTrackRequestDto } from '../src/api/task-track/dto/task-track.request.dto';

describe('UserProfileController (e2e)', () => {
  let app: INestApplication;
  let userProfileService: UserProfileService;
  let taskService: TaskService;
  let userTaskService: UserTaskService;
  let taskTrackService: TaskTrackService;
  let httpServer;
  let createdUser1: UserProfileResponse;
  let createdUser2: UserProfileResponse;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserProfileModule,
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
      .useValue([Role.USER])
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userProfileService = moduleFixture.get<UserProfileService>(UserProfileService);
    taskService = moduleFixture.get<TaskService>(TaskService);
    userTaskService = moduleFixture.get<UserTaskService>(UserTaskService);
    taskTrackService = moduleFixture.get<TaskTrackService>(TaskTrackService);
    httpServer = app.getHttpServer();

    await getRepository(DirectionEntity).createQueryBuilder().insert().values(directionsStub).execute();
    await getRepository(TaskStateEntity).createQueryBuilder().insert().values(taskStatesStub).execute();
  });

  beforeEach(async () => {
    await getRepository(UserProfileEntity).createQueryBuilder().delete().execute();
    // add users
    createdUser1 = await userProfileService.create(createUserProfileDto_1);
    createdUser2 = await userProfileService.create(createUserProfileDto_2);
  });

  afterAll(async () => {
    await getRepository(DirectionEntity).createQueryBuilder().delete().execute();
    await getRepository(TaskStateEntity).createQueryBuilder().delete().execute();
    await getRepository(UserProfileEntity).createQueryBuilder().delete().execute();
    await app.close();
  });

  it('/users (GET)', async () => {
    const response = await request(httpServer).get('/users');

    expect(response.status).toBe(200);
    expect(response.body.totalCount).toBe(2);
    expect(response.body.offset).toBe(0);
    expect(response.body.limit).toBe(10);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toEqual({
      id: expect.any(String),
      firstName: 'Lena',
      lastName: 'Pavlova',
      education: 'BNTU',
      address: 'ul. behtereva 19-33',
      birthDate: '1996-06-24',
      startDate: '2021-01-01',
      universityAverageScore: 7,
      mathScore: 6,
      sex: 'female',
      skype: 'lepav',
      email: 'lena.pavlova@gmail.com',
      mobilePhone: '+375294344455',
      roles: ['user'],
      directionName: 'PHP',
    });
    expect(response.body.data[1]).toEqual({
      id: expect.any(String),
      firstName: 'Max',
      lastName: 'Losik',
      education: 'BNTU',
      address: 'ul. volgograda 45-33',
      birthDate: '1989-12-30',
      startDate: '2020-03-23',
      universityAverageScore: 7.3,
      mathScore: 6.3,
      sex: 'male',
      skype: 'maxLosik',
      email: 'max.losik@gmail.com',
      mobilePhone: '+375296678799',
      roles: ['user'],
      directionName: 'Angular',
    });
  });

  it('/users/:id (GET)', async () => {
    // have to get id  for user by uniq email because it's generated every test from scratch
    const id = ((await userProfileService.getAll()) as UserProfileDto[]).find(
      ({ email }) => email === 'lena.pavlova@gmail.com',
    ).id;

    const response = await request(httpServer).get(`/users/${id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(String),
      firstName: 'Lena',
      lastName: 'Pavlova',
      education: 'BNTU',
      address: 'ul. behtereva 19-33',
      birthDate: '1996-06-24',
      startDate: '2021-01-01',
      universityAverageScore: 7,
      mathScore: 6,
      sex: 'female',
      skype: 'lepav',
      email: 'lena.pavlova@gmail.com',
      mobilePhone: '+375294344455',
      roles: ['user'],
      directionName: 'PHP',
    });
  });

  it('/users (POST)', async () => {
    const createUserProfileDto: UserProfileRequestDto = {
      firstName: 'Oksana',
      lastName: 'Polleva',
      directionName: DirectionType.ANGULAR,
      education: 'BSUIR',
      address: 'Pr. Mrai 144-35',
      birthDate: '1994-03-14',
      startDate: '2020-04-13',
      universityAverageScore: 6.9,
      mathScore: 5,
      sex: Gender.FEMALE,
      skype: 'wwomen',
      email: 'spl.wwomen@gmail.com',
      mobilePhone: '+375296334402',
      roles: [Role.USER],
      password: 'qwa123125',
      repeatPassword: 'qwa123125',
    };

    const response = await request(httpServer).post('/users').send(createUserProfileDto);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      firstName: 'Oksana',
      lastName: 'Polleva',
      directionName: DirectionType.ANGULAR,
      education: 'BSUIR',
      address: 'Pr. Mrai 144-35',
      birthDate: '1994-03-14',
      startDate: '2020-04-13',
      universityAverageScore: 6.9,
      mathScore: 5,
      sex: Gender.FEMALE,
      skype: 'wwomen',
      email: 'spl.wwomen@gmail.com',
      mobilePhone: '+375296334402',
      roles: [Role.USER],
    });
  });

  it('/users/:id (PATCH)', async () => {
    const response = await request(httpServer).patch(`/users/${createdUser1.id}`).send({
      education: 'BGU',
      address: 'ul. Napaleona Ordi 12-3',
    });

    expect(response.status).toBe(200);
    expect(response.body.address).not.toBe('ul. volgograda 45-33');
    expect(response.body.education).not.toBe('BNTU');
    expect(response.body).toEqual({
      id: expect.any(String),
      firstName: 'Max',
      lastName: 'Losik',
      directionName: DirectionType.ANGULAR,
      education: 'BGU',
      address: 'ul. Napaleona Ordi 12-3',
      birthDate: '1989-12-30',
      startDate: '2020-03-23',
      universityAverageScore: 7.3,
      mathScore: 6.3,
      sex: Gender.MALE,
      skype: 'maxLosik',
      email: 'max.losik@gmail.com',
      mobilePhone: '+375296678799',
      roles: [Role.USER],
    });
  });

  it('/users/:id (DELETE)', async () => {
    const response = await request(httpServer).delete(`/users/${createdUser2.id}`);

    expect(response.status).toBe(200);
    expect(response.body.affected).toBe(1);
  });

  it('/users/:id/progress (GET)', async () => {
    // add user tasks
    await taskService.create(createTaskDto1);
    await taskService.create(createTaskDto2);

    const tasks = await taskService.getAll();
    const users = await userProfileService.getAll();

    const firstUserId = users[0].id;
    const secondUserId = users[1].id;

    createTaskDto1.assignedUsers = [firstUserId, secondUserId];
    createTaskDto2.assignedUsers = [firstUserId];

    await userTaskService.create({
      userId: firstUserId,
      taskId: tasks[0].id,
    });
    await userTaskService.create({
      userId: firstUserId,
      taskId: tasks[1].id,
    });
    await userTaskService.create({
      userId: firstUserId,
      taskId: tasks[2].id,
    });
    await userTaskService.create({
      userId: secondUserId,
      taskId: tasks[1].id,
    });
    await userTaskService.create({
      userId: secondUserId,
      taskId: tasks[2].id,
    });

    const firstUserFirstTaskId = (await userTaskService.getAll(firstUserId))[0].id;

    const createTaskTracksDto1: TaskTrackRequestDto = {
      date: '2020-12-30',
      note: 'Delete id from table <UserProfile>',
    };

    const createTaskTracksDto2: TaskTrackRequestDto = {
      date: '2021-01-16',
      note: 'Delete Name from table <UserProfile>',
    };

    await taskTrackService.create(firstUserFirstTaskId, createTaskTracksDto1);
    await taskTrackService.create(firstUserFirstTaskId, createTaskTracksDto2);

    const response = await request(httpServer).get(`/users/${createdUser1.id}/progress`);

    console.log('progress', response.body)
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});
