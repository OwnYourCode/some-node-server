import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class TaskTrackRequestDto {
  @ApiProperty()
  @IsOptional()
  userTaskId?: string;

  @ApiProperty({ example: '2001-01-07', format: 'YYYY-mm-dd' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'add status procedure for state entity' })
  @IsOptional()
  note?: string;
}
