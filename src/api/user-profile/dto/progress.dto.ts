import { ApiProperty } from '@nestjs/swagger';

export class ProgressDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  taskId: number;

  @ApiProperty()
  taskTrackId: number;

  @ApiProperty({ example: 'Maksim' })
  userName: string;

  @ApiProperty({ example: 'Create database' })
  taskName: string;

  // TODO: should be array of tracks for concrete task
  @ApiProperty({ example: 'Create user table' })
  trackName: string;

  @ApiProperty({ example: '2021-11-07', format: 'YYYY-mm-dd' })
  trackDate: string;
}
