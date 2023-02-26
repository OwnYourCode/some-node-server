import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../model/task.entity';
import { getConnection, getRepository, Repository } from 'typeorm';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { TaskResponseDto } from '../dto/task.response.dto';
import { plainToClass } from 'class-transformer';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { UserTaskService } from '../../user-task/service/user-task.service';
import { TaskRequestDto } from '../dto/task.request.dto';
import { UserTaskEntity } from '../../user-task/model/user-task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly userTaskService: UserTaskService,
    private readonly loggerService: DIMSLoggerService,
  ) {}

  public async getAll(): Promise<TaskResponseDto[]> {
    const tasksWithAssignedUsers = await getRepository(TaskEntity)
      .createQueryBuilder('task')
      .leftJoin('task.userTasks', 'userTasks')
      .select(['task.id', 'task.name', 'task.description', 'task.deadlineDate', 'task.startDate', 'userTasks.userId'])
      .getMany();

    this.loggerService.logMessage('tasksWithAssignedUserTasks', tasksWithAssignedUsers);

    return TaskService.mapToDtos(tasksWithAssignedUsers);
  }

  private getTaskWithAssignedUsers = async (id: string) => {
    return await getRepository(TaskEntity)
      .createQueryBuilder('task')
      .leftJoin('task.userTasks', 'userTasks')
      .select([
        'task.id',
        'task.name',
        'task.description',
        'task.deadlineDate',
        'task.startDate',
        'userTasks.userId',
        'userTasks.stateId',
      ])
      .where('task.id = :id', { id })
      .getOne();
  };

  public async getById(id: string): Promise<TaskResponseDto> {
    const taskWithAssignedUsers = await this.getTaskWithAssignedUsers(id);

    if (!taskWithAssignedUsers) {
      throw new HttpException(`Task by ${id} is not found`, 401);
    }

    this.loggerService.logMessage('taskEntity', taskWithAssignedUsers);

    return TaskService.mapToDto(taskWithAssignedUsers);
  }

  public async create(task: TaskRequestDto): Promise<TaskResponseDto> {
    const createdTask = await this.taskRepository.save(task);
    this.loggerService.logMessage('createdTask', createdTask);

    if (task.assignedUsers?.length) {
      const assignedUsers = task.assignedUsers;
      this.loggerService.logMessage('assignedUsers', assignedUsers);

      await this.userTaskService.assignTaskToUsers(createdTask.id, assignedUsers);
    }

    return createdTask as unknown as TaskResponseDto;
  }

  public async update(id: string, task: UpdateTaskDto): Promise<TaskResponseDto> {
    const taskEntity = await this.getTaskWithAssignedUsers(id);

    if (!taskEntity) {
      throw new NotFoundException(`User by id - ${id} is not found`);
    }
    this.loggerService.logMessage('taskEntity', taskEntity);

    if (taskEntity.userTasks && task.assignedUsers) {
      this.loggerService.logMessage('assignedUsers', task.assignedUsers);
      const existedAssignedUsers = taskEntity.userTasks.map(({userId}) => userId);
      if (!task.assignedUsers) {
        // DELETE all assigned to the user tasks
        await this.deleteAssignedTaskToUsers(id, existedAssignedUsers);
      } else {
        await this.deleteAssignedTaskToUsers(id, existedAssignedUsers);
        if (task.assignedUsers && !existedAssignedUsers.length) {
          await this.userTaskService.assignTaskToUsers(id, task.assignedUsers);
        } else {
          const assignedUsers = existedAssignedUsers.filter((user) => task.assignedUsers.indexOf(user) !== -1);
          await this.userTaskService.assignTaskToUsers(id, assignedUsers);
        }
      }
    }

    const mappedTask = plainToClass(TaskEntity, {
      ...TaskService.mapToDto(taskEntity),
      ...task,
    });

    this.loggerService.logMessage('mappedTask', mappedTask);

    const savedTask = await this.taskRepository.save(mappedTask);
    this.loggerService.logMessage('savedTask', savedTask);

    return savedTask as unknown as TaskResponseDto;
  }

  async deleteAssignedTaskToUsers(taskId: string, assignedUsers: string[]) {
    if (assignedUsers.length) {
      for (const assignedUser of assignedUsers) {
        await getConnection().query('DELETE FROM "userTask" ut where ut."userId" = $1 and ut."taskId" = $2', [
          assignedUser,
          taskId,
        ]);
      }
    }
  }

  public async delete(id: string): Promise<{ affected: number | null }> {
    const task = await this.taskRepository.findOne(id);
    this.loggerService.logMessage('delete task', task);
    if (!task) {
      return;
    }

    const { affected } = await this.taskRepository.delete(id);

    this.loggerService.logMessage('affected', affected);

    return { affected };
  }


  private static mapToDtos(entities: TaskEntity[]): TaskResponseDto[] {
    return entities.map(TaskService.mapToDto);
  }

  private static mapToDto({ userTasks, ...restProps }: TaskEntity): TaskResponseDto {
    return {
      assignedUsers: userTasks?.map(({ userId }) => userId) ?? [],
      ...restProps,
    } as unknown as TaskResponseDto;
  }
}



