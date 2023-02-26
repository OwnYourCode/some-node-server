import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { ListResponseDto } from './list-response.dto';

export class BaseResponseDto extends ListResponseDto {
  @ApiProperty({ example: '2021-08-22', format: 'format: YYYY-mm-dd' })
  @IsNotEmpty()
  @IsDateString()
  @AutoMap()
  createdAt: string;

  @ApiProperty({ example: '2021-08-22', format: 'format: YYYY-mm-dd' })
  @IsNotEmpty()
  @IsDateString()
  @AutoMap()
  updatedAt: string;
}
