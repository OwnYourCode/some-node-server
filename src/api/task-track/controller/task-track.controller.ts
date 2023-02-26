import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TaskTrackService } from '../service/task-track.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { TaskTrackRequestDto } from '../dto/task-track.request.dto';
import { UpdateTaskTrackDto } from '../dto/update-task-track.dto';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/enums/role.enum';
import { TaskTrackResponseDto } from '../dto/task-track.response.dto';

@ApiBearerAuth()
@ApiTags('tracks')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('users/:userId/user-tasks/:userTaskId')
export class TaskTrackController {
  constructor(private readonly taskTrackService: TaskTrackService, private readonly loggerService: DIMSLoggerService) {}

  @Get('tracks')
  @ApiOperation({
    summary: 'Get all task subtasks',
    description: 'Get all task subtasks',
  })
  @ApiOkResponse({
    description: 'All tasks subtasks of the current user are successfully returned',
    type: [TaskTrackResponseDto],
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async getAll(
    @Param('userId') userId: string,
    @Param('userTaskId') userTaskId: string,
  ): Promise<TaskTrackResponseDto[]> {
    this.loggerService.logMessage('userId', userId);
    this.loggerService.logMessage('userTaskId', userTaskId);

    return this.taskTrackService.getAll(userId, userTaskId);
  }

  @Get('tracks/:taskTrackId')
  @ApiOperation({
    summary: 'Get task subtask by Id',
    description: 'Get task subtask by Id',
  })
  @ApiOkResponse({
    description: 'Task subtask by Id is successfully returned',
    type: TaskTrackResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Task subtask not found',
  })
  getById(
    @Param('userId') userId: string,
    @Param('userTaskId') userTaskId: string,
    @Param('taskTrackId') taskTrackId: string,
  ): Promise<TaskTrackResponseDto> {
    this.loggerService.logMessage('userTaskId', userTaskId);
    this.loggerService.logMessage('taskTrackId', taskTrackId);

    return this.taskTrackService.getById(userTaskId, taskTrackId);
  }

  @Post('tracks')
  @ApiOkResponse({
    description: 'Task subtask is successfully created',
    type: TaskTrackRequestDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  create(
    @Param('userId') userId: string,
    @Param('userTaskId') userTaskId: string,
    @Body() createTaskTrackDto: TaskTrackRequestDto,
  ): Promise<TaskTrackResponseDto> {
    this.loggerService.logMessage('userTaskId', userTaskId);
    this.loggerService.logMessage('createTaskTrackDto', createTaskTrackDto);

    return this.taskTrackService.create(userTaskId, createTaskTrackDto);
  }

  @Put('tracks/:taskTrackId')
  @ApiOperation({
    summary: 'Update task subtask by id',
    description: 'Update task subtask by id',
  })
  @ApiOkResponse({
    description: 'Task subtask  is successfully updated',
    type: UpdateTaskTrackDto,
  })
  @ApiNotFoundResponse({
    description: 'Task subtask not found',
  })
  update(
    @Param('userId') userId: string,
    @Param('userTaskId') userTaskId: string,
    @Param('taskTrackId') taskTrackId: string,
    @Body() updateTaskTrackDto: UpdateTaskTrackDto,
  ): Promise<TaskTrackResponseDto> {
    this.loggerService.logMessage('taskTrackId', taskTrackId);
    this.loggerService.logMessage('updateTaskTrackDto', updateTaskTrackDto);

    return this.taskTrackService.update(taskTrackId, updateTaskTrackDto);
  }

  @Delete('tracks/:taskTrackId')
  @ApiOperation({
    summary: 'Delete task subtask by id',
    description: 'Delete task subtask by id',
  })
  @ApiOkResponse({
    description: 'Task subtask is successfully deleted',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  delete(
    @Param('userId') userId: string,
    @Param('userTaskId') userTaskId: string,
    @Param('taskTrackId') taskTrackId: string,
  ) {
    return this.taskTrackService.delete(taskTrackId);
  }
}
