import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { eightSymbolsAtLeastOneLetterAtLeastOneNumber } from '../../../shared/constants';
import { ApiProperty } from '@nestjs/swagger';

export interface ILoginUser {
  email: string;
  password: string;
}

export class UserLoginDto implements ILoginUser {
  @ApiProperty({ example: 'senior.junior@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'qwe123123' })
  @IsString()
  @MinLength(8)
  @Matches(eightSymbolsAtLeastOneLetterAtLeastOneNumber, {
    message: 'Minimum eight characters, at least one letter and one number',
  })
  password: string;
}
