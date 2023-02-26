import { ApiProperty } from '@nestjs/swagger';
import { TaskState } from '../model/task-state.enum';
import { IsEnum } from 'class-validator';

export class TaskStateDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'fail', enum: Object.values(TaskState) })
  @IsEnum(TaskState)
  name: TaskState;
}
