import { ApiProperty } from '@nestjs/swagger';
import { DirectionType } from '../model/direction.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateDirectionDto {
  @ApiProperty({ example: 'React', enum: Object.values(DirectionType) })
  @IsEnum(DirectionType)
  @IsNotEmpty()
  name: DirectionType;

  @ApiProperty({ example: "It's modern library widely used in front-end", required: false })
  description?: string;
}
