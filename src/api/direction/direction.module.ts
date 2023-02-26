import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectionEntity } from './model/direction.entity';
import { DirectionService } from './service/direction.service';
import { DirectionController } from './controller/direction.controller';
import { DIMSLoggerService } from '../../logger/logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([DirectionEntity])],
  providers: [DirectionService, DIMSLoggerService],
  controllers: [DirectionController],
  exports: [],
})
export class DirectionModule {}
