import { UserProfileDto } from '../../../api/user-profile/dto/user-profile.dto';
import { DirectionType } from '../../../api/direction/model/direction.enum';
import { Role } from '../../enums/role.enum';
import { UserProfileRequestDto } from '../../../api/user-profile/dto/user-profile.request.dto';
import { Gender } from '../../enums/gender.enum';

const userProfileDto1: UserProfileDto = {
  id: '74d34a17-1c3e-4b1c-af38-b11c178bec28',
  firstName: 'Max',
  lastName: 'Losik',
  directionName: DirectionType.ANGULAR,
  education: 'BNTU',
  address: 'ul. volgograda 45-33',
  birthDate: '1989-12-30',
  startDate: '2020-03-23',
  universityAverageScore: 7.3,
  mathScore: 6.3,
  sex: Gender.MALE,
  skype: 'maxLosik',
  email: 'max.losik@gmail.com',
  mobilePhone: '+375296678799',
  roles: [Role.USER],
};

const userProfileDto2 = {
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
};

const userProfileDto3 = {
  id: '7a1c8cda-370a-4803-a6d5-d751bde035c8',
  firstName: 'Max',
  lastName: 'Shch',
  directionName: DirectionType.REACT,
  education: 'BNTU',
  address: 'Pr. Partizanski 88-14',
  birthDate: '1989-04-28',
  startDate: '2019-01-30',
  sex: Gender.MALE,
  email: 'maximsan1989@gmail.com',
  mobilePhone: '+375293482742',
  universityAverageScore: 8.6,
  mathScore: 7.7,
  roles: [Role.ADMIN, Role.MENTOR],
};

const userProfileDto4 = {
  id: 'ff7b53c0-cbc9-43c8-a58e-04f438e9a7a8',
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
};

export const usersProfilesStub: UserProfileDto[] = [userProfileDto1, userProfileDto2, userProfileDto3, userProfileDto4];

export const createUserProfileDto_1: UserProfileRequestDto = {
  firstName: 'Max',
  lastName: 'Losik',
  directionName: DirectionType.ANGULAR,
  education: 'BNTU',
  address: 'ul. volgograda 45-33',
  birthDate: '1989-12-30',
  startDate: '2020-03-23',
  universityAverageScore: 7.3,
  mathScore: 6.3,
  sex: Gender.MALE,
  skype: 'maxLosik',
  email: 'max.losik@gmail.com',
  mobilePhone: '+375296678799',
  roles: [Role.USER],
  password: 'qwe123123',
  repeatPassword: 'qwe123123',
};

export const createUserProfileDto_2: UserProfileRequestDto = {
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
  password: 'qwe123123',
  repeatPassword: 'qwe123123',
};

export const createUserProfileDto_3: UserProfileRequestDto = {
  firstName: 'Max',
  lastName: 'Shch',
  directionName: DirectionType.REACT,
  education: 'BNTU',
  address: 'Pr. Partizanski 88-14',
  birthDate: '1989-04-28',
  startDate: '2019-01-30',
  sex: Gender.MALE,
  email: 'maximsan1989@gmail.com',
  mobilePhone: '+375293482742',
  universityAverageScore: 8.6,
  mathScore: 7.7,
  roles: [Role.ADMIN, Role.MENTOR],
  password: 'qwe123123',
  repeatPassword: 'qwe123123',
};

export const createUserProfileDto_4: UserProfileRequestDto = {
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

export const createUserProfilesStub = [
  createUserProfileDto_1,
  createUserProfileDto_2,
  createUserProfileDto_3,
  createUserProfileDto_4,
];
