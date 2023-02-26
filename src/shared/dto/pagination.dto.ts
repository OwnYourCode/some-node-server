import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ example: 10, required: false, description: 'how many items we want to get' })
  limit: number;

  @ApiProperty({
    example: 0,
    required: false,
    description: 'offset is the amount of data we will skip according to limit',
  })
  offset: number;
}
