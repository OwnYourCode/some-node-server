import { Column, Entity, OneToMany } from 'typeorm';
import { UserProfileEntity } from '../../user-profile/model/user-profile.entity';
import { DirectionType } from './direction.enum';
import { CommonEntity } from '../../../shared/interfaces/common-entity';

@Entity({ name: 'direction' })
export class DirectionEntity extends CommonEntity {
  @Column({
    type: 'enum',
    enum: DirectionType,
    default: DirectionType.REACT,
  })
  name: DirectionType;

  @Column({ length: 150, nullable: true })
  description?: string;

  @OneToMany(() => UserProfileEntity, (userProfile) => userProfile.direction, {
    cascade: true,
  })
  userProfiles?: UserProfileEntity[];
}
