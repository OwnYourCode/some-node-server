import { UserProfileDto } from './user-profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfilePaginationDto {
  @ApiProperty({ type: [UserProfileDto] })
  data: UserProfileDto[];

  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalCount: number;
}
