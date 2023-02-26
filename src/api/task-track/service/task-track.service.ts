import { HttpException, Injectable } from '@nestjs/common';
import { TaskTrackDto } from '../dto/task-track.dto';
import { TaskTrackEntity } from '../model/task-track.entity';
import { getRepository, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskTrackRequestDto } from '../dto/task-track.request.dto';
import { DIMSLoggerService } from '../../../logger/logger.service';
import { plainToClass } from 'class-transformer';
import { UpdateTaskTrackDto } from '../dto/update-task-track.dto';
import { TaskTrackResponseDto } from '../dto/task-track.response.dto';

@Injectable()
export class TaskTrackService {
  constructor(
    @InjectRepository(TaskTrackEntity)
    private readonly taskTrackRepository: Repository<TaskTrackEntity>,
    private readonly loggerService: DIMSLoggerService,
  ) {}

  /**
   * get all tracks
   * @param userId
   * @param taskId
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAll(userId: string, taskId: string): Promise<TaskTrackResponseDto[]> {
    const result = await this.taskTrackRepository.find();

    this.loggerService.logMessage('all task tracks', result);

    return result as unknown as TaskTrackResponseDto[];
  }

  /**
   * get all tracks for task by id
   * @param userTaskId
   * @param taskTrackId
   */
  async getById(userTaskId: string, taskTrackId: string): Promise<TaskTrackResponseDto> {
    const taskTrack = await getRepository(TaskTrackEntity)
      .createQueryBuilder('taskTrack')
      .where('taskTrack.userTaskId = :userTaskId AND taskTrack.id = :taskTrackId', { userTaskId, taskTrackId })
      .getOne();

    this.loggerService.logMessage('taskTrack', taskTrack);
    if (!taskTrack) {
      throw new HttpException(`Task track by id=${taskTrackId} is not found`, 400);
    }

    return taskTrack as unknown as TaskTrackResponseDto;
  }

  async update(taskTrackId: string, updateTaskTrackDto: UpdateTaskTrackDto): Promise<TaskTrackResponseDto> {
    const taskTrack = await this.taskTrackRepository.findOne({ id: taskTrackId });
    if (!taskTrack) {
      throw new HttpException(`Task track by ${taskTrackId} is not found`, 400);
    }

    this.loggerService.logMessage('taskTrack', taskTrack);
    this.loggerService.logMessage('updateTaskTrackDto', updateTaskTrackDto);

    const mappedTaskTrack = plainToClass(TaskTrackEntity, {
      ...taskTrack,
      ...updateTaskTrackDto,
    });
    this.loggerService.logMessage('mappedTaskTrack', mappedTaskTrack);

    const savedTaskTrack = await this.taskTrackRepository.save(mappedTaskTrack);
    this.loggerService.logMessage('savedTaskTrack', savedTaskTrack);

    return savedTaskTrack as unknown as TaskTrackResponseDto;
  }

  async create(userTaskId: string, createTaskTrackDto: TaskTrackRequestDto): Promise<TaskTrackResponseDto> {
    const newTaskTrack = plainToClass(TaskTrackEntity, { userTaskId, ...createTaskTrackDto });
    const createdTaskTrack = await this.taskTrackRepository.save(newTaskTrack);
    this.loggerService.logMessage('createdTaskTrack', createdTaskTrack);

    return createdTaskTrack as unknown as TaskTrackResponseDto;
  }

  async delete(taskTrackId: string): Promise<{ affected: number }> {
    const { affected } = await this.taskTrackRepository.delete(taskTrackId);

    return { affected };
  }
}
