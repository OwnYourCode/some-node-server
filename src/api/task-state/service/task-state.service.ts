import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TaskStateEntity } from '../model/task-state.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStateDto } from '../dto/task-state.dto';
import { plainToClass } from 'class-transformer';
import { ReadOnlyService } from '../../../shared/interfaces/service';
import { TaskState } from '../model/task-state.enum';
import { CreateTaskStateDto } from '../dto/create-task-state.dto';
import { DIMSLoggerService } from '../../../logger/logger.service';

@Injectable()
export class TaskStateService implements ReadOnlyService<TaskStateDto> {
  constructor(
    @InjectRepository(TaskStateEntity)
    private readonly taskStateRepository: Repository<TaskStateEntity>,
    private readonly logger: DIMSLoggerService,
  ) {}

  public async getAll(): Promise<TaskStateDto[]> {
    const taskStateEntities = await this.taskStateRepository.find();

    return this.mapToDtos(taskStateEntities);
  }

  public async getTaskStateId(name: TaskState): Promise<TaskStateEntity> {
    return this.taskStateRepository.findOne({ name });
  }

  public async create(taskState: CreateTaskStateDto): Promise<CreateTaskStateDto> {
    const createdTaskState = await this.taskStateRepository.save(taskState);

    this.logger.logMessage('createdTaskState', createdTaskState);

    return TaskStateService.mapToCreateDto(createdTaskState);
  }

  public async delete(id: string): Promise<void> {
    await this.taskStateRepository.delete(id);
  }

  private static mapToCreateDto(entity: TaskStateEntity) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...restEntity } = entity;
    return plainToClass(CreateTaskStateDto, restEntity);
  }

  private mapToDtos(entities: TaskStateEntity[]): TaskStateDto[] {
    return entities.map((entity) => {
      return plainToClass(TaskStateDto, entity);
    });
  }
}
