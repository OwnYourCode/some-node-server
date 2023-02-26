import { ApiProperty } from '@nestjs/swagger';

export class UserTaskDto {
  @ApiProperty({ example: '22334a17-1c3e-4b1c-af38-b11c178bec28' })
  id: string;

  @ApiProperty({ example: '22334a17-1c3e-4b1c-af38-b11c178bec28' })
  taskId: string;

  @ApiProperty({ example: '22334a17-1c3e-4b1c-af38-b11c178bec28' })
  userId: string;

  @ApiProperty({ example: '22334a17-1c3e-4b1c-af38-b11c178bec28' })
  stateId: string;

  @ApiProperty({ example: '22334a17-1c3e-4b1c-af38-b11c178bec28' })
  taskTrackId?: string;
}
