import { IntersectionType } from '@nestjs/swagger';
import { UserRequestDto } from './user-request.dto';
import { ListResponseDto } from '../../shared/dto/list-response.dto';

export class UserResponseDto extends IntersectionType(ListResponseDto, UserRequestDto) {}
