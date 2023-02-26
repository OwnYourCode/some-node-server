import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserTaskService } from '../service/user-task.service';
import { UserTaskDto } from '../dto/user-task.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserTaskRequestDto } from '../dto/user-task.request.dto';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/enums/role.enum';
import { UserTaskResponseDto } from '../dto/user-task.response.dto';
import { TaskResponseDto } from '../../task/dto/task.response.dto';

@ApiBearerAuth()
@ApiTags('user-tasks')
@UseGuards(RolesGuard)
@Controller('users/:id')
export class UserTaskController {
  constructor(private readonly userTaskService: UserTaskService, private readonly loggerService: DIMSLoggerService) {}

  @Roles(Role.ADMIN, Role.MENTOR, Role.USER)
  @Get('user-tasks')
  @ApiOperation({
    summary: 'Get user tasks',
    description: 'Get user tasks',
  })
  @ApiOkResponse({
    description: 'All tasks of the current user are successfully returned',
    type: [UserTaskDto],
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async getAll(@Param('id') id: string): Promise<TaskResponseDto[]> {
    this.loggerService.logMessage('***get user tasks by userId***', id);

    return await this.userTaskService.getAll(id);
  }

  @Roles(Role.ADMIN, Role.MENTOR)
  @Get('user-tasks/:userTaskId')
  @ApiOperation({
    summary: 'Get user task by Id',
    description: 'Get user task by Id',
  })
  @ApiOkResponse({
    description: 'The task of the current user by Id is successfully returned',
    type: UserTaskDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async getById(@Param('id') id: string, @Param('userTaskId') userTaskId: string): Promise<UserTaskDto> {
    this.loggerService.logMessage('userId', id);
    this.loggerService.logMessage('taskId', userTaskId);

    return await this.userTaskService.getById(id, userTaskId);
  }

  @Roles(Role.ADMIN, Role.MENTOR)
  @Post('user-tasks')
  @ApiOperation({
    summary: 'Create a new user task',
    description: 'Create a new user task',
  })
  @ApiCreatedResponse({
    description: 'User task is successfully created',
    type: UserTaskRequestDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async create(@Body() createUserTaskDto: UserTaskRequestDto): Promise<UserTaskResponseDto> {
    this.loggerService.logMessage('createUserTaskDto', createUserTaskDto);

    return this.userTaskService.create(createUserTaskDto);
  }

  @Roles(Role.ADMIN, Role.MENTOR)
  @Delete('user-tasks/:userTaskId')
  @ApiOperation({
    summary: 'Delete user task by id',
    description: 'Delete user task by id',
  })
  @ApiOkResponse({
    description: 'User task is successfully deleted',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async delete(@Param('userTaskId') userTaskId: string): Promise<{ affected: number }> {
    this.loggerService.logMessage('userTaskId', userTaskId);

    return this.userTaskService.delete(userTaskId);
  }
}
