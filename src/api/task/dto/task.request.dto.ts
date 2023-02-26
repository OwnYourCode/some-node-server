import { ApiProperty } from '@nestjs/swagger';

export class TaskRequestDto {
  @ApiProperty({ example: 'Create table Task' })
  name: string;

  @ApiProperty({ example: 'Create table Task with following fields: ....', required: false })
  description: string;

  @ApiProperty({ example: '2020-12-22', format: 'YYYY-mm-dd' })
  deadlineDate: string;

  @ApiProperty({ example: '2020-12-05', format: 'YYYY-mm-dd' })
  startDate: string;

  @ApiProperty({
    example: [
      '7a1c8cda-370a-4803-a6d5-d751bde035c8',
      '211c8cda-370a-4803-a6d5-d751bde035c8',
      '334c8cda-370a-4803-a6d5-d751bde035c8',
    ],
  })
  assignedUsers?: string[];
}
