import { ApiProperty } from '@nestjs/swagger';
import { DirectionType } from '../direction/model/direction.enum';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Gender } from '../../shared/enums/gender.enum';
import { Role } from '../../shared/enums/role.enum';

export class UserRequestDto {
  @ApiProperty({ example: 'Alex' })
  firstName: string;

  @ApiProperty({ example: 'Mishin' })
  lastName: string;

  @ApiProperty({ example: 'React', enum: Object.values(DirectionType) })
  @IsNotEmpty()
  @IsEnum(DirectionType)
  directionName: DirectionType;

  @ApiProperty({ example: 'BSUIR' })
  education: string;

  @ApiProperty({ example: 'Pr. Pobedi 38-19' })
  address: string;

  @ApiProperty({ example: '2001-01-07', format: 'YYYY-mm-dd' })
  birthDate: string;

  @ApiProperty({ example: '2020-01-28', format: 'YYYY-mm-dd' })
  startDate: string;

  @ApiProperty({ example: 7.7 })
  universityAverageScore: number;

  @IsNumber()
  @ApiProperty({ example: 7.5 })
  mathScore: number;

  @ApiProperty({ example: 'male', enum: Object.values(Gender) })
  @IsEnum(Gender)
  sex: Gender;

  @ApiProperty({ example: 'alexMishin', required: false })
  skype?: string;

  @ApiProperty({ example: 'alex.mishin@mail.ru' })
  email: string;

  @ApiProperty({ example: '+375293245464', required: false })
  mobilePhone?: string;

  @ApiProperty({ example: 'admin', enum: Object.values(Role), type: 'array' })
  @IsEnum(Role)
  roles: Role[];
}
