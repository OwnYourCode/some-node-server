import { Test } from '@nestjs/testing';
import { UserProfileController } from './user-profile.controller';
import { UserProfileService } from '../service/user-profile.service';
import { DirectionService } from '../../direction/service/direction.service';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { UserProfileRequestDto } from '../dto/create-user-profile.dto';
import { DirectionType } from '../../direction/model/direction.enum';
import { Role } from '../../../shared/enums/role.enum';
import { Gender } from '../../../shared/enums/gender.enum';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import { usersProfilesStub } from '../../../shared/test/stub/userProfiles.stub';

describe('UserProfileController', () => {
  let userProfileController: UserProfileController;

  const mockDirectionService = {};
  const mockUserProfileService = {
    getAll: jest.fn().mockResolvedValue(usersProfilesStub),
    getById: jest.fn().mockImplementation((userId: string) => {
      return Promise.resolve(usersProfilesStub.find(({ id }) => id === userId));
    }),
    create: jest.fn().mockImplementation((userProfile: UserProfileRequestDto): Promise<UserProfileRequestDto> => {
      return Promise.resolve(userProfile);
    }),
    update: jest
      .fn()
      .mockImplementation((userId: string, user: UpdateUserProfileDto): Promise<UpdateUserProfileDto> => {
        const userProfile = usersProfilesStub.find(({ id }) => id === userId);
        const updatedUser = { ...userProfile, ...user };
        return Promise.resolve(updatedUser);
      }),
    delete: jest.fn().mockImplementation((userId: string) => {
      const index = usersProfilesStub.findIndex(({ id }) => id === userId);
      usersProfilesStub.splice(index, 1);
      const affectedItems = 1;
      return Promise.resolve(affectedItems);
    }),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserProfileController],
      providers: [UserProfileService, DirectionService, DIMSLoggerService],
    })
      .overrideProvider(DirectionService)
      .useValue(mockDirectionService)
      .overrideProvider(UserProfileService)
      .useValue(mockUserProfileService)
      .compile();

    userProfileController = module.get<UserProfileController>(UserProfileController);
  });

  it('should be defined', () => {
    expect(userProfileController).toBeDefined();
  });

  it('should create a user profile', async () => {
    const newUserProfile: UserProfileRequestDto = {
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

    const actualUserProfile = await userProfileController.create(newUserProfile);

    expect(mockUserProfileService.create).toHaveBeenCalled();
    expect(mockUserProfileService.create).toHaveBeenCalledTimes(1);
    expect(mockUserProfileService.create).toHaveBeenCalledWith(newUserProfile);

    expect(actualUserProfile).toStrictEqual({
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
    });
  });

  it('should get a user profile by id', async () => {
    const idUserId = 'fefe18a7-2a4a-4fb3-aafd-c566ac7f4802';
    const findUser = await userProfileController.getById(idUserId);

    expect(findUser).toStrictEqual({
      id: 'fefe18a7-2a4a-4fb3-aafd-c566ac7f4802',
      firstName: 'Lena',
      lastName: 'Pavlova',
      directionName: DirectionType.PHP,
      education: 'BNTU',
      address: 'ul. behtereva 19-33',
      birthDate: '1996-06-24',
      startDate: '2021-01-01',
      universityAverageScore: 7.0,
      mathScore: 6.0,
      sex: Gender.FEMALE,
      skype: 'lepav',
      email: 'lena.pavlova@gmail.com',
      mobilePhone: '+375294344455',
      roles: [Role.USER],
    });
  });

  it('should get all user profiles', async () => {
    const actualUsers = await userProfileController.getAll();

    expect(actualUsers).toStrictEqual(usersProfilesStub);
    expect(actualUsers).toHaveLength(4);
  });

  it('should update a user profile by id', async () => {
    const actualUser = await userProfileController.update('74d34a17-1c3e-4b1c-af38-b11c178bec28', {
      firstName: 'Max',
      lastName: 'Loshkov',
      directionName: DirectionType.ANGULAR,
      education: 'BNTU',
      address: 'ul. Volgograda 45-33',
      birthDate: '1989-12-30',
      startDate: '2020-03-23',
      universityAverageScore: 7.3,
      mathScore: 6.3,
      sex: Gender.MALE,
      skype: 'maxLoshkov',
      email: 'max.loshkov@gmail.com',
      mobilePhone: '+375296678799',
      roles: [Role.USER, Role.MENTOR],
      password: '1qwe234r',
      repeatPassword: '1qwe234r',
    });

    expect(actualUser).toStrictEqual({
      id: '74d34a17-1c3e-4b1c-af38-b11c178bec28',
      firstName: 'Max',
      lastName: 'Loshkov',
      directionName: DirectionType.ANGULAR,
      education: 'BNTU',
      address: 'ul. Volgograda 45-33',
      birthDate: '1989-12-30',
      startDate: '2020-03-23',
      universityAverageScore: 7.3,
      mathScore: 6.3,
      sex: Gender.MALE,
      skype: 'maxLoshkov',
      email: 'max.loshkov@gmail.com',
      mobilePhone: '+375296678799',
      roles: [Role.USER, Role.MENTOR],
      password: '1qwe234r',
      repeatPassword: '1qwe234r',
    });
  });

  it('should delete user profile by id', async () => {
    expect(await userProfileController.getAll()).toHaveLength(4);
    expect(await userProfileController.delete('ff7b53c0-cbc9-43c8-a58e-04f438e9a7a')).toBe(1);
    expect(await userProfileController.getAll()).toHaveLength(3);
  });
});
