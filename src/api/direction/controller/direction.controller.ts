import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { DirectionService } from '../service/direction.service';
import { DirectionDto } from '../dto/direction.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDirectionDto } from '../dto/create-direction.dto';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/enums/role.enum';

/**
 * only accessible by admin
 **/

@ApiBearerAuth()
@ApiTags('directions')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('directions')
export class DirectionController {
  constructor(private readonly directionService: DirectionService, private readonly loggerService: DIMSLoggerService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all available directions',
    description: 'Returns all available directions',
  })
  @ApiOkResponse({
    description: 'All available directions are successfully returned',
    type: [DirectionDto],
  })
  async getDirections(): Promise<DirectionDto[]> {
    return this.directionService.getAll();
  }

  @Post()
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: 'Create a new direction',
    description: 'Create a new direction',
  })
  @ApiCreatedResponse({
    description: 'Direction is successfully created',
    type: CreateDirectionDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async create(@Body() createDirection: CreateDirectionDto): Promise<CreateDirectionDto> {
    this.loggerService.logMessage('create direction', createDirection);

    return await this.directionService.create(createDirection);
  }

  /**
   * excluded by default
   * only accessible by admin, but not on production
   * @param id
   */

  @Delete()
  @ApiExcludeEndpoint()
  async delete(@Param('id') id: string): Promise<void> {
    this.loggerService.logMessage('delete direction by id', id);

    return await this.directionService.delete(id);
  }
}
