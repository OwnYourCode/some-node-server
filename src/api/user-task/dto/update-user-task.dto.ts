import { PartialType } from '@nestjs/mapped-types';
import { UserTaskRequestDto } from './user-task.request.dto';

export class UpdateUserTaskDto extends PartialType(UserTaskRequestDto) {}
