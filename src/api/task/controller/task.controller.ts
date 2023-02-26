import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { IBaseController } from '../../../shared/interfaces/base-controller';
import { TaskResponseDto } from '../dto/task.response.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TaskService } from '../service/task.service';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/enums/role.enum';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { TaskRequestDto } from '../dto/task.request.dto';

@ApiBearerAuth()
@ApiTags('tasks')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.MENTOR)
@Controller('tasks')
export class TaskController implements IBaseController<TaskRequestDto, TaskResponseDto, UpdateTaskDto> {
  constructor(private readonly loggerService: DIMSLoggerService, private readonly taskService: TaskService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all available tasks',
    description: 'Returns all available tasks',
  })
  @ApiOkResponse({
    description: 'All tasks are successfully returned',
    type: [TaskResponseDto],
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async getAll(): Promise<TaskResponseDto[]> {
    this.loggerService.logMessage('***getAll tasks***', {});

    return this.taskService.getAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get task by id',
    description: 'Get task by id',
  })
  @ApiOkResponse({
    description: 'Task is successfully added',
    type: TaskResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Task is not found',
  })
  async getById(@Param('id') id: string): Promise<TaskResponseDto> {
    this.loggerService.logMessage('***task get by id***', id);

    return await this.taskService.getById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Create a new task',
  })
  @ApiCreatedResponse({
    description: 'Task is successfully created',
    type: TaskResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async create(@Body() createTaskDto: TaskRequestDto): Promise<TaskResponseDto> {
    this.loggerService.logMessage('***create createTaskDto***', createTaskDto);

    return await this.taskService.create(createTaskDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update task by id',
    description: 'Update task by id',
  })
  @ApiOkResponse({
    description: 'Task is successfully updated',
    type: UpdateTaskDto,
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
  })
  async update(@Param('id') id: string, @Body() task: UpdateTaskDto): Promise<TaskResponseDto> {
    this.loggerService.logMessage('***patch task by id***', id);
    this.loggerService.logMessage('***patch task by UpdateTaskDto***', task);

    return await this.taskService.update(id, task);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete task by id',
    description: 'Delete task by id',
  })
  @ApiOkResponse({
    description: 'Task is successfully deleted',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async delete(@Param('id') id: string): Promise<{ affected: number | null }> {
    this.loggerService.logMessage('***delete task by id***', id);

    return await this.taskService.delete(id);
  }
}
