import { PartialType } from '@nestjs/swagger';
import { UserProfileRequestDto } from './user-profile.request.dto';

export class UpdateUserProfileDto extends PartialType(UserProfileRequestDto) {}
