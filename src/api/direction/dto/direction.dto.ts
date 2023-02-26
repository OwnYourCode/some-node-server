import { ApiProperty } from '@nestjs/swagger';
import { DirectionType } from '../model/direction.enum';
import { IsEnum } from 'class-validator';

export class DirectionDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'React', enum: Object.values(DirectionType) })
  @IsEnum(DirectionType)
  name: DirectionType;

  @ApiProperty({ example: "It's modern library widely used in front-end", required: false })
  description?: string;
}
