import {Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards} from '@nestjs/common';
import { UserProfileService } from '../service/user-profile.service';
import { UserProfileDto } from '../dto/user-profile.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserProfileRequestDto } from '../dto/user-profile.request.dto';
import { IBaseController } from '../../../shared/interfaces/base-controller';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import { ProgressDto } from '../dto/progress.dto';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { Role } from '../../../shared/enums/role.enum';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { UserProfilePaginationDto } from '../dto/user-profile.pagination.dto';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { ApiImplicitQuery } from '@nestjs/swagger/dist/decorators/api-implicit-query.decorator';

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('users')
export class UserProfileController
  implements
    IBaseController<
      UserProfileDto | UserProfilePaginationDto,
      UserProfileRequestDto,
      UpdateUserProfileDto,
      PaginationDto
    >
{
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly loggerService: DIMSLoggerService,
  ) {}

  @Roles(Role.MENTOR)
  @Get()
  @ApiOperation({
    summary: 'Get all registered users',
    description: 'Returns all registered users',
  })
  @ApiOkResponse({
    description: 'All users are successfully returned',
    type: [UserProfilePaginationDto],
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  @ApiImplicitQuery({
    name: 'limit',
    required: false,
  })
  @ApiImplicitQuery({
    name: 'offset',
    required: false,
  })
  async getAll(
    // TODO: check if it's fixed, because it doesn't work like this in swagger docs
    // @Query('userProfileQuery') userProfileQuery: PaginationDto,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ): Promise<Array<UserProfileDto> | UserProfilePaginationDto> {
    this.loggerService.logMessage('***getAll user profiles query params***', { limit, offset });

    const result = await this.userProfileService.getAll({ limit, offset });

    this.loggerService.logMessage('***getAll user profiles result***', result);

    return result;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get registered user by id',
    description: 'Get registered user by id',
  })
  @ApiCreatedResponse({
    description: 'User is successfully returned',
    type: UserProfileDto,
  })
  @ApiNotFoundResponse({
    description: 'User is not found',
  })
  async getById(@Param('id') id: string): Promise<UserProfileDto> {
    this.loggerService.logMessage('***user profile get by id***', id);

    return this.userProfileService.getById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user profile',
    description: 'Create a new user profile',
  })
  @ApiCreatedResponse({
    description: 'User is successfully created',
    type: UserProfileRequestDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async create(@Body() createUserProfileDto: UserProfileRequestDto): Promise<UserProfileRequestDto> {
    this.loggerService.logMessage('***create UserProfileDto***', createUserProfileDto);

    return this.userProfileService.create(createUserProfileDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user profile by id',
    description: 'Update user profile by id',
  })
  @ApiOkResponse({
    description: 'User is successfully updated',
    type: UserProfileRequestDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async update(@Param('id') id: string, @Body() updateUserProfileDto: UserProfileRequestDto): Promise<UserProfileDto> {
    this.loggerService.logMessage('***update user by id***', id);
    this.loggerService.logMessage('***update user by dto***', updateUserProfileDto);

    return this.userProfileService.update(id, updateUserProfileDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Partial update user profile by id',
    description: 'Partial update user profile by id',
  })
  @ApiOkResponse({
    description: 'User is successfully updated',
    type: UpdateUserProfileDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async patch(@Param('id') id: string, @Body() updateUserProfileDto: UpdateUserProfileDto): Promise<UserProfileDto> {
    this.loggerService.logMessage('***patch user by id***', id);
    this.loggerService.logMessage('***patch user by dto***', updateUserProfileDto);

    return this.userProfileService.update(id, updateUserProfileDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user profile by id',
    description: 'Delete user profile by id',
  })
  @ApiOkResponse({
    description: 'User is successfully deleted',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async delete(@Param('id') id: string): Promise<{ affected: number | null }> {
    this.loggerService.logMessage('***delete user profile by id***', id);

    return this.userProfileService.delete(id);
  }

  @Roles(Role.MENTOR)
  @Get(':id/progress')
  @ApiOperation({
    summary: 'Get user progress',
    description: "Get user progress includes tasks' subtasks or just tasks",
  })
  @ApiOkResponse({
    description: 'Full user progress is successfully returned',
    type: [ProgressDto],
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
  })
  async getProgress(@Param('id') id: string): Promise<ProgressDto[]> {
    this.loggerService.logMessage('***get user progress by id***', id);

    return this.userProfileService.getProgressById(id);
  }
}
