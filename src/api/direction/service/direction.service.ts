/* eslint-disable @typescript-eslint/no-unused-vars */

import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {DirectionEntity} from '../model/direction.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {ReadOnlyService} from 'src/shared/interfaces/service';
import {DirectionDto} from '../dto/direction.dto';
import {plainToClass} from 'class-transformer';
import {DirectionType} from '../model/direction.enum';
import {DIMSLoggerService} from '../../../logger/logger.service';
import {CreateDirectionDto} from '../dto/create-direction.dto';
import {IntersectionType, PickType} from "@nestjs/swagger";

class CreateDirectionResponse extends IntersectionType(PickType(DirectionEntity, ['id'] as const), CreateDirectionDto) {
}

@Injectable()
export class DirectionService implements ReadOnlyService<DirectionDto> {
  constructor(
    @InjectRepository(DirectionEntity)
    private readonly directionRepository: Repository<DirectionEntity>,
    private readonly loggerService: DIMSLoggerService,
  ) {
  }

  public async getAll(): Promise<DirectionDto[]> {
    const directions = await this.directionRepository.find();

    return this.mapToDtos(directions);
  }

  public async create(direction: CreateDirectionDto): Promise<CreateDirectionResponse> {
    const createdDirection = await this.directionRepository.save(direction);

    this.loggerService.logMessage('createDirection', createdDirection);

    return DirectionService.mapToCreateDto(createdDirection);
  }

  public async getByName(name: DirectionType): Promise<DirectionDto> {
    this.loggerService.logMessage('name', name);

    const direction = await this.directionRepository.findOne({name});
    this.loggerService.logMessage('direction', direction);

    return DirectionService.mapToDto(direction);
  }

  public async delete(id: string): Promise<void> {
    await this.directionRepository.delete(id);
  }

  private static mapToCreateDto(directionEntity: DirectionDto): CreateDirectionResponse {
    const {id, ...restEntity} = directionEntity;
    return plainToClass(CreateDirectionResponse, restEntity);
  }

  private static mapToDto(directionEntity: DirectionEntity): DirectionDto {
    return plainToClass(DirectionDto, directionEntity);
  }

  private mapToDtos(directionEntities: DirectionEntity[]): DirectionDto[] {
    return directionEntities.map((item) => {
      const {userProfiles, ...restUserEntity} = item;
      return plainToClass(DirectionDto, {...restUserEntity});
    });
  }
}
