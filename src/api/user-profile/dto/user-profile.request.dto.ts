import { ApiProperty } from '@nestjs/swagger';
import { DirectionType } from '../../direction/model/direction.enum';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Matches, MinLength } from 'class-validator';
import { Gender } from '../../../shared/enums/gender.enum';
import { ICreateUserProfile } from '../model/user-profile.interface';
import { Role } from '../../../shared/enums/role.enum';
import { eightSymbolsAtLeastOneLetterAtLeastOneNumber } from '../../../shared/constants';
import { Match } from '../../../shared/decorators/match.decorator';

export class UserProfileRequestDto implements ICreateUserProfile {
  @ApiProperty({ example: 'Alex' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Mishin' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'React', enum: Object.values(DirectionType) })
  @IsNotEmpty()
  @IsEnum(DirectionType)
  directionName: DirectionType;

  @ApiProperty({ example: 'BSUIR' })
  @IsNotEmpty()
  @IsString()
  education: string;

  @ApiProperty({ example: 'Pr. Pobedi 38-19' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: '2001-01-07', format: 'YYYY-mm-dd' })
  @IsDateString()
  @IsNotEmpty()
  @IsString()
  birthDate: string;

  @ApiProperty({ example: '2020-01-28', format: 'YYYY-mm-dd' })
  @IsDateString()
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiProperty({ example: 7.7 })
  @IsNotEmpty()
  @IsNumber()
  universityAverageScore: number;

  @IsNumber()
  @ApiProperty({ example: 7.5 })
  @IsNotEmpty()
  @IsNumber()
  mathScore: number;

  @ApiProperty({ example: 'male', enum: Object.values(Gender) })
  @IsNotEmpty()
  @IsEnum(Gender)
  sex: Gender;

  @ApiProperty({ example: 'alexMishin', required: false })
  skype?: string;

  @ApiProperty({ example: 'senior.junior@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+375293245464', required: false })
  mobilePhone?: string;

  @ApiProperty({ example: ['admin'], enum: Object.values(Role), type: 'array' })
  @IsNotEmpty()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @ApiProperty({ example: 'qwe123123' })
  @IsString()
  @MinLength(8)
  @Matches(eightSymbolsAtLeastOneLetterAtLeastOneNumber, {
    message: 'Minimum eight characters, at least one letter and one number',
  })
  password: string;

  @ApiProperty({ example: 'qwe123123' })
  @IsString()
  @MinLength(8)
  @Match('password', {
    message: 'Passwords must match',
  })
  repeatPassword: string;
}
