import { HttpException, Injectable } from '@nestjs/common';
import { UserTaskDto } from '../dto/user-task.dto';
import { getRepository, Repository } from 'typeorm';
import { UserTaskEntity } from '../model/user-task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { UserTaskRequestDto } from '../dto/user-task.request.dto';
import { TaskState } from '../../task-state/model/task-state.enum';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { TaskStateService } from '../../task-state/service/task-state.service';
import { UserProfileService } from '../../user-profile/service/user-profile.service';
import { UpdateUserTaskDto } from '../dto/update-user-task.dto';
import { TaskEntity } from '../../task/model/task.entity';
import { UserTaskResponseDto } from '../dto/user-task.response.dto';
import { TaskResponseDto } from '../../task/dto/task.response.dto';

@Injectable()
export class UserTaskService {
  constructor(
    @InjectRepository(UserTaskEntity)
    private readonly userTaskRepository: Repository<UserTaskEntity>,
    private readonly taskStateService: TaskStateService,
    private readonly loggerService: DIMSLoggerService,
    private readonly userProfileService: UserProfileService,
  ) {}

  /**
   * assign task to users and mark it as active
   * @param taskId
   * @param assignedUsers
   */
  async assignTaskToUsers(taskId, assignedUsers: string[]) {
    for (const assignedUser of assignedUsers) {
      // throw error if you try to update not existed user by mistake
      const existedUser = this.userProfileService.getById(assignedUser);
      if (!existedUser) {
        this.loggerService.logMessage('existedUser is not real', existedUser);
        throw new HttpException(`You trying to update not existed user by id - ${assignedUser}`, 400);
      }
      this.loggerService.logMessage('existedUser', existedUser);

      // get stateId of ACTIVE state
      const stateId = (await this.taskStateService.getTaskStateId(TaskState.ACTIVE)).id;
      this.loggerService.logMessage('stateId', stateId);

      const createUserTaskDto = plainToClass(UserTaskResponseDto, {
        userId: assignedUser,
        taskId,
        stateId,
      });
      await this.create(createUserTaskDto);
    }
  }

  async create(createUserTaskDto: UserTaskRequestDto): Promise<UserTaskResponseDto> {
    // get stateId of ACTIVE state
    const stateId = (await this.taskStateService.getTaskStateId(TaskState.ACTIVE)).id;
    this.loggerService.logMessage('stateId', stateId);

    const createFullUserTaskDto = plainToClass(UserTaskRequestDto, {
      ...createUserTaskDto,
      stateId,
    });

    const createdUserTask = await this.userTaskRepository.save(createFullUserTaskDto);
    this.loggerService.logMessage('createdUserTask', createdUserTask);

    return UserTaskService.mapToCreateDto(createdUserTask);
  }

  private static mapToCreateDto(entity: UserTaskEntity): UserTaskResponseDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...restEntity } = entity;
    return plainToClass(UserTaskResponseDto, restEntity);
  }

  async getAll(userId: string): Promise<TaskResponseDto[]> {
    const userTasks = await this.userTaskRepository.find({ userId });
    this.loggerService.logMessage('userTasks', userTasks);

    const tasks: TaskResponseDto[] = [];
    for (const userTask of userTasks) {
      const task = await getRepository(TaskEntity)
        .createQueryBuilder('task')
        .where('task.id = :id', { id: userTask.taskId })
        .getOne();

      this.loggerService.logMessage('task', task);
      tasks.push({
        ...task,
        id: userTask.id,
      } as unknown as TaskResponseDto);
    }

    this.loggerService.logMessage('tasks', tasks);
    return tasks;
  }

  async getById(userId: string, id: string): Promise<any> {
    const userTask = await getRepository(UserTaskEntity)
      .createQueryBuilder('userTask')
      .where('userTask.id = :id AND userTask.userId = :userId', { id, userId })
      .getOne();

    this.loggerService.logMessage('userTask', userTask);

    const task = await getRepository(TaskEntity)
      .createQueryBuilder('task')
      .where('task.id = :id', { id: userTask?.taskId })
      .getOne();

    this.loggerService.logMessage('task', task);

    return task;
  }

  async update(id: string, updateUserTaskDto: UpdateUserTaskDto): Promise<UpdateUserTaskDto> {
    const userTask = await this.userTaskRepository.findOne(id);
    if (!userTask) {
      throw new HttpException(`User task by ${id} is not found`, 400);
    }
    this.loggerService.logMessage('userTask', userTask);

    const savedUserTask = await this.userTaskRepository.save(updateUserTaskDto);

    return UserTaskService.mapToDto(savedUserTask);
  }

  async delete(id: string): Promise<{ affected: number }> {
    const { affected } = await this.userTaskRepository.delete(id);

    return { affected };
  }

  private static mapToDto(entity: UserTaskEntity): UserTaskDto {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...restEntity } = entity;
    return plainToClass(UserTaskDto, restEntity);
  }
}
