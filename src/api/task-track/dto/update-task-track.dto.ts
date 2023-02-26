import { PartialType } from '@nestjs/swagger';
import { TaskTrackRequestDto } from './task-track.request.dto';

export class UpdateTaskTrackDto extends PartialType(TaskTrackRequestDto) {}
