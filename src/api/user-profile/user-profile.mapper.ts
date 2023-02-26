import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import {createMap, Mapper, MappingProfile} from '@automapper/core';
import { UserProfileEntity } from './model/user-profile.entity';
import { UserResponseDto } from './user-response.dto';
import { UserRequestDto } from './user-request.dto';

// TODO: integrate automapper
@Injectable()
export class UserProfileMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UserProfileEntity, UserResponseDto);
      createMap(mapper, UserRequestDto, UserProfileEntity);
    };
  }
}
