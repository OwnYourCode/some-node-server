import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ITask } from '../model/task.interface';
import { BaseResponseDto } from '../../../shared/dto/base-response.dto';

export class TaskResponseDto extends BaseResponseDto implements ITask {
  @ApiProperty({ example: 'Create table Task' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Create table Task in database with following fields: ....', required: false })
  @IsOptional()
  description: string;

  @ApiProperty({ example: '2020-12-22', format: 'YYYY-mm-dd' })
  @IsNotEmpty()
  @IsDateString()
  deadlineDate: string;

  @ApiProperty({ example: '2020-12-05', format: 'YYYY-mm-dd' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: [
      '7a1c8cda-370a-4803-a6d5-d751bde035c8',
      '211c8cda-370a-4803-a6d5-d751bde035c8',
      '334c8cda-370a-4803-a6d5-d751bde035c8',
    ],
  })
  @IsString({ each: true })
  assignedUsers?: string[];
}

