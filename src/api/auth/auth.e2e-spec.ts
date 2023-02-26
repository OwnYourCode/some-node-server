import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthService } from './service/auth.service';
import { UserProfileService } from '../user-profile/service/user-profile.service';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthModule } from './auth.module';
import {DirectionType} from "../direction/model/direction.enum";
import {Role} from "../../shared/enums/role.enum";
import {Gender} from "../../shared/enums/gender.enum";
import {UserProfileRequestDto} from "../user-profile/dto/user-profile.request.dto";

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userProfileService: UserProfileService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    userProfileService = moduleFixture.get<UserProfileService>(UserProfileService);
  });

  xit('/auth (POST)', async () => {
    // create new user
    const newUser: UserProfileRequestDto = {
      firstName: 'Max',
      lastName: 'Super',
      directionName: DirectionType.NET,
      education: 'BSUIR',
      address: 'Pr. Kedishko 10-37',
      birthDate: '1992-03-15',
      startDate: '2021-02-18',
      universityAverageScore: 9.9,
      mathScore: 10,
      sex: Gender.MALE,
      skype: 'superMax',
      email: 'super.max@gmail.com',
      mobilePhone: '+375297777777',
      roles: [Role.ADMIN, Role.MENTOR, Role.USER],
      password: 'qwe123123',
      repeatPassword: 'qwe123123',
    };
    await userProfileService.create(newUser);
    const loggingUser: UserLoginDto = {
      email: 'super.max@gmail.com',
      password: 'qwe123123',
    };
    const validUser = await authService.validateUser(loggingUser);
    console.log('validUser', validUser);
    const token = await authService.createLoginResponse(validUser as unknown as UserLoginDto);
    console.log('token', token);

    return request(app.getHttpServer()).get('/login').expect(200).expect(token);
  });

  xit('/ (GET)', () => {
    return request(app.getHttpServer()).get('/ping').expect(200).expect('ping!');
  });

  it('login', async () => {
    const loggingUser: UserLoginDto = {
      email: 'super.max@gmail.com',
      password: 'qwe123123',
    };
    const loginReq = await request(app.getHttpServer()).post('/auth/login').send(loggingUser).expect(200);
    const token = loginReq.body.access_token;
    console.log(token);
  });

  afterAll(async () => {
    await app.close();
  });
});
