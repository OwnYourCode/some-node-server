import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

export class ListResponseDto {
  @ApiProperty({ example: '7a1c8cda-370a-4803-a6d5-d751bde035c8' })
  @AutoMap()
  id?: string;
}
