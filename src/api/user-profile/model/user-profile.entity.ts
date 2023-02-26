import { Entity, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';
import { UserTaskEntity } from '../../user-task/model/user-task.entity';
import { DirectionEntity } from '../../direction/model/direction.entity';
import { Gender } from '../../../shared/enums/gender.enum';
import { Role } from '../../../shared/enums/role.enum';
import { hash, genSalt } from 'bcrypt';
import { CommonEntity } from '../../../shared/interfaces/common-entity';

@Entity({ name: 'userProfile' })
export class UserProfileEntity extends CommonEntity {
  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ length: 50 })
  education: string;

  @Column({ length: 120 })
  address: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'float' })
  universityAverageScore: number;

  @Column({ type: 'float' })
  mathScore: number;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  sex: Gender;

  @Column({ length: 50, nullable: true })
  skype?: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 50, nullable: true })
  mobilePhone?: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  roles: Role[];

  @Column({ length: 150 })
  password: string;

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword?(password) {
    console.log('BeforeInsert, BeforeUpdate', this);
    const salt = await genSalt();

    this.password = await hash(password || this.password, salt);
  }

  /**
   * it creates relation between user profile directionId and direction directionId
   */
  @ManyToOne(() => DirectionEntity, (direction) => direction.userProfiles, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'directionId' })
  direction: DirectionEntity;

  /**
   * it creates relation between user profile userId and user task userId
   */
  @OneToMany(() => UserTaskEntity, (userTask) => userTask.user, {
    cascade: true,
  })
  userTasks: Promise<UserTaskEntity[]>;
}
