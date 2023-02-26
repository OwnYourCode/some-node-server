import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileService } from './user-profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserProfileEntity } from '../model/user-profile.entity';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { DirectionService } from '../../direction/service/direction.service';
import { UserProfileRequestDto } from '../dto/create-user-profile.dto';
import { DirectionType } from '../../direction/model/direction.enum';
import { Role } from '../../../shared/enums/role.enum';
import { DirectionDto } from '../../direction/dto/direction.dto';
import { Gender } from '../../../shared/enums/gender.enum';

describe('UserProfileService', () => {
  let userProfileService: UserProfileService;

  const mockDirectionService = {
    getByName: jest.fn().mockImplementation(
      (directionName): Promise<DirectionDto> =>
        Promise.resolve({
          id: '123',
          name: directionName,
          description: 'Random direction description',
        }),
    ),
  };
  const mockUserProfileRepository = {
    create: jest.fn().mockImplementation((dto: UserProfileRequestDto) => {
      return Promise.resolve(dto);
    }),
    save: jest.fn().mockImplementation((user) => {
      return Promise.resolve(user);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileService,
        DirectionService,
        DIMSLoggerService,
        {
          provide: getRepositoryToken(UserProfileEntity),
          useValue: mockUserProfileRepository,
        },
      ],
    })
      .overrideProvider(DirectionService)
      .useValue(mockDirectionService)
      .compile();

    userProfileService = module.get<UserProfileService>(UserProfileService);
  });

  it('should be defined', () => {
    expect(userProfileService).toBeDefined();
  });

  it('should create a new user profile', async () => {
    expect(
      await userProfileService.create({
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
        roles: [Role.ADMIN],
        password: 'qwe123123',
        repeatPassword: 'qwe123123',
      }),
    ).toEqual({
      firstName: 'Max',
      lastName: 'Super',
      directionName: '.Net',
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
      roles: [Role.ADMIN],
    });
  });
});
