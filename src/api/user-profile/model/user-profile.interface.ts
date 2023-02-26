import { DirectionType } from '../../direction/model/direction.enum';
import { Gender } from '../../../shared/enums/gender.enum';
import { Role } from '../../../shared/enums/role.enum';

export interface IUserProfileFields {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IRegister {
  password: string;
  repeatPassword: string;
}

export interface IRole {
  roles: Role[];
}

export interface IUserProfile extends IUserProfileFields, IRole {
  directionName: DirectionType;
  education: string;
  address: string;
  birthDate: string;
  startDate: string;
  universityAverageScore: number;
  mathScore: number;
  sex: Gender;
  skype?: string;
  mobilePhone?: string;
}

export interface ICreateUserProfile extends IUserProfile, IRegister {}
