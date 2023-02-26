import { ApiProperty } from '@nestjs/swagger';

export class TaskTrackDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userTaskId: string;

  @ApiProperty({ example: '2001-01-07', format: 'YYYY-mm-dd' })
  date: string;

  @ApiProperty({ example: 'add status procedure for state entity' })
  note?: string;
}
