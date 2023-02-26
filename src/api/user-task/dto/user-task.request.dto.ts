import { ApiProperty } from '@nestjs/swagger';
import {IsOptional, IsString} from 'class-validator';

export class UserTaskRequestDto {
  @ApiProperty({ example: '22334a17-1c3e-4b1c-af38-b11c178bec28' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '1a234a17-1c3e-4b1c-af38-b11c178bec28' })
  @IsString()
  taskId: string;

  @ApiProperty({ example: '22334a17-1c3e-4b1c-af38-b11c178bec28' })
  @IsOptional()
  taskTrackId?: string;
}
