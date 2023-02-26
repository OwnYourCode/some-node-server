import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TaskStateService } from '../service/task-state.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TaskStateDto } from '../dto/task-state.dto';
import { CreateTaskStateDto } from '../dto/create-task-state.dto';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/enums/role.enum';
import { CreateDirectionDto } from '../../direction/dto/create-direction.dto';

@ApiBearerAuth()
@ApiTags('task-states')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('task-states')
export class TaskStateController {
  constructor(private readonly taskStateService: TaskStateService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all available task states',
    description: 'Returns all available task states',
  })
  @ApiOkResponse({
    description: 'All available task states are successfully returned',
    type: [TaskStateDto],
  })
  async getAll(): Promise<TaskStateDto[]> {
    return await this.taskStateService.getAll();
  }

  /**
   * only accessible by admin
   * @param createTaskDto
   */

  @Post()
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Create a new task state',
    description: 'Create a new task state',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Task state is successfully created',
    type: CreateDirectionDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async create(@Body() createTaskDto: CreateTaskStateDto): Promise<CreateTaskStateDto> {
    return await this.taskStateService.create(createTaskDto);
  }

  /**
   * excluded by default
   * only accessible by admin, but not on production
   * @param id
   */

  @Delete()
  @ApiExcludeEndpoint()
  async delete(@Param('id') id: string): Promise<void> {
    return await this.taskStateService.delete(id);
  }
}
