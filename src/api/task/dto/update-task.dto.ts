import { PartialType } from '@nestjs/swagger';
import { TaskResponseDto } from './task.response.dto';

export class UpdateTaskDto extends PartialType(TaskResponseDto) {}
