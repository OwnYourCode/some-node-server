import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfileEntity } from '../model/user-profile.entity';
import { getRepository, Repository } from 'typeorm';
import { UserProfileDto } from '../dto/user-profile.dto';
import { plainToClass } from 'class-transformer';
import { Service } from 'src/shared/interfaces/service';
import { DirectionService } from '../../direction/service/direction.service';
import { UserProfileRequestDto } from '../dto/user-profile.request.dto';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { UpdateUserProfileDto } from '../dto/update-user-profile.dto';
import { UserTaskEntity } from '../../user-task/model/user-task.entity';
import { PaginationDto } from '../../../shared/dto/pagination.dto';
import { UserProfilePaginationDto } from '../dto/user-profile.pagination.dto';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { generatePasswordHash } from '../../../shared/password-utils';

export class UserProfileEntityExtended extends IntersectionType(
  IntersectionType(UserProfileEntity, PickType(UserProfileDto, ['directionName'] as const)),
  PickType(UserProfileRequestDto, ['repeatPassword'] as const),
) {}

export class UserProfileResponse extends IntersectionType(
  PickType(UserProfileEntity, ['id'] as const),
  UserProfileRequestDto,
) {}

@Injectable()
export class UserProfileService implements Service<UserProfileDto | UserProfileRequestDto, PaginationDto> {
  constructor(
    @InjectRepository(UserProfileEntity)
    private readonly userProfileRepository: Repository<UserProfileEntity>,
    private readonly directionService: DirectionService,
    private readonly loggerService: DIMSLoggerService,
  ) {}

  public async getAll(queryParams?: PaginationDto): Promise<UserProfileDto[] | UserProfilePaginationDto> {
    if (queryParams && Object.keys(queryParams).length) {
      const { limit, offset = 0 } = queryParams;

      const skip = offset * limit;
      this.loggerService.logMessage('offset', offset);
      this.loggerService.logMessage('limit', limit);
      this.loggerService.logMessage('skip', skip);

      const [userProfilesEntities, totalCount] = await getRepository(UserProfileEntity)
        .createQueryBuilder('userProfile')
        .leftJoinAndSelect('userProfile.direction', 'direction')
        .orderBy('userProfile.createdAt', 'DESC')
        .offset(skip)
        .take(limit)
        .getManyAndCount();

      this.loggerService.logMessage('totalCount', totalCount);
      this.loggerService.logMessage('userProfilesEntities', userProfilesEntities);

      const data = this.mapToDtos(userProfilesEntities);

      this.loggerService.logMessage('mapped userProfilesEntities', data);

      return {
        totalCount,
        offset,
        limit,
        data,
      } as UserProfilePaginationDto;
    }

    const userProfilesEntities = await this.userProfileRepository.find({ relations: ['direction'] });

    return this.mapToDtos(userProfilesEntities);
  }

  public async getById(id: string): Promise<UserProfileDto | null> {
    const userProfileEntity = await getRepository(UserProfileEntity)
      .createQueryBuilder('userProfile')
      .leftJoinAndSelect('userProfile.direction', 'direction')
      .where('userProfile.id = :id', { id })
      .getOne();

    this.loggerService.logMessage('userProfile', JSON.stringify(userProfileEntity));

    if (!userProfileEntity) {
      throw new NotFoundException(`User by id - ${id} is not found`);
    }

    return UserProfileService.mapToDto(userProfileEntity as UserProfileEntityExtended);
  }

  public async getByEmail(email: string) {
    return this.userProfileRepository.findOne({ email }, { relations: ['direction'] });
  }

  public async create(createUserProfileDto: UserProfileRequestDto): Promise<UserProfileResponse> {
    // TODO: create validation decorator for this
    const age = UserProfileService.getUserAge(createUserProfileDto.birthDate);
    if (age < 18) {
      throw new HttpException('Age violation: user is under age of 18', 400);
    }

    // TODO: get direction for user, probably can be moved to typeorm relations
    const direction = await this.directionService.getByName(createUserProfileDto.directionName);

    this.loggerService.logMessage('direction', direction);
    this.loggerService.logMessage('createUserProfileDto', createUserProfileDto);

    // check if user already exist with this email
    const existedUser = await this.getByEmail(createUserProfileDto.email);
    if (existedUser) {
      throw new HttpException('Email must be uniq', 400);
    }

    this.loggerService.logMessage('existedUser', existedUser);

    const newUserProfile = this.userProfileRepository.create({
      ...createUserProfileDto,
      direction,
    });

    this.loggerService.logMessage('newUserProfile', newUserProfile);

    const savedUserProfile = (await this.userProfileRepository.save(newUserProfile)) as UserProfileEntityExtended;

    this.loggerService.logMessage('savedUserProfile', savedUserProfile);

    return UserProfileService.mapToCreateDto(savedUserProfile);
  }

  public async update(id: string, newUserProfile: UpdateUserProfileDto): Promise<UserProfileDto | null> {
    const userProfile = await this.userProfileRepository.findOne(id, { relations: ['direction'] });

    if (!userProfile) {
      throw new NotFoundException(`User by id - ${id} is not found`);
    }

    this.loggerService.logMessage('userProfile', userProfile);
    this.loggerService.logMessage('newUserProfile', newUserProfile);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { repeatPassword, directionName, password, ...rest } = newUserProfile;

    const direction = await this.directionService.getByName(directionName);

    const savedUserProfile: UserProfileEntity = {
      ...userProfile,
      ...rest,
      password: password ? await generatePasswordHash(password) : userProfile.password,
      direction: direction ?? userProfile.direction,
    };
    this.loggerService.logMessage('savedUserProfile', savedUserProfile);

    const result = await this.userProfileRepository.save(savedUserProfile);

    this.loggerService.logMessage('update result', result);

    return UserProfileService.mapToDto(savedUserProfile as UserProfileEntityExtended);
  }

  public async delete(id: string): Promise<{ affected: number | null }> {
    const userProfile = await this.userProfileRepository.findOne(id);
    this.loggerService.logMessage('delete userProfile', userProfile);
    if (!userProfile) {
      return;
    }
    const { affected } = await this.userProfileRepository.delete(id);
    this.loggerService.logMessage('affected', affected);

    return { affected };
  }

  /**
   * get user progress - create list of user work includes tasks' subtasks if it has them
   * or just task
   * @param userId
   */
  public async getProgressById(userId: string) {
    // TODO: get user progress if task state in ['active', 'fail', 'success'] except 'pending' and task has subtasks
    // TODO: get users tasks if task has subtasks return it too
    const wholeUserTasksAndSubTasks = await getRepository(UserTaskEntity)
      .createQueryBuilder('userTask')
      .where('userTask.userId = :userId', { userId })
      .leftJoin('userTask.taskTracks', 'taskTracks')
      .leftJoin('userTask.states', 'taskStates')
      .where('taskStates.name IN (:...stateNames)', { stateNames: ['active', 'fail', 'success'] })
      .select()
      .getMany();

    console.log('getProgressById', wholeUserTasksAndSubTasks);

    return wholeUserTasksAndSubTasks as any;
  }

  private mapToDtos(userProfileEntities: UserProfileEntity[]): UserProfileDto[] {
    return userProfileEntities.map((userProfileEntity) => {
      return UserProfileService.mapToDto(userProfileEntity as UserProfileEntityExtended);
    });
  }

  private static mapToDto(entity: UserProfileEntityExtended): UserProfileDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { direction, password, createdAt, updatedAt, directionName, ...restUserEntity } = entity;
    return plainToClass(UserProfileDto, {
      ...restUserEntity,
      directionName: directionName || (direction?.name ?? ''),
    });
  }

  private static mapToCreateDto(entity: UserProfileEntityExtended): UserProfileResponse {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { direction, updatedAt, createdAt, password, repeatPassword, ...restUserEntity } = entity;
    return plainToClass(UserProfileResponse, {
      ...restUserEntity,
      directionName: direction?.name ?? '',
    });
  }

  private static getUserAge(dateString: string) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }
}
