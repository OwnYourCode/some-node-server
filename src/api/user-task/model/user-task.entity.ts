import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserProfileEntity } from '../../user-profile/model/user-profile.entity';
import { TaskEntity } from '../../task/model/task.entity';
import { TaskTrackEntity } from '../../task-track/model/task-track.entity';
import { TaskStateEntity } from '../../task-state/model/task-state.entity';
import { CommonEntity } from '../../../shared/interfaces/common-entity';

/**
 * As always it's better to create join table by your own
 * It's easier to maintain and add additional columns, constraints
 */

@Entity({ name: 'userTask' })
export class UserTaskEntity extends CommonEntity {
  @Column({ type: 'uuid', nullable: true })
  taskTrackId?: string;
  @OneToMany(() => TaskTrackEntity, (taskTrack) => taskTrack.userTask, { cascade: true })
  @JoinColumn({ name: 'taskId' })
  taskTracks: TaskTrackEntity[];

  /**
   * if we delete task we want related user tasks to be deleted too
   * (by setting onDelete='CASCADE')
   */
  @Column({ type: 'uuid' })
  taskId: string;
  @ManyToOne(() => TaskEntity, (task) => task.userTasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;

  /**
   * if we delete user profile we want related user tasks to be deleted too
   * (by setting onDelete='CASCADE')
   */
  @Column({ type: 'uuid' })
  userId: string;
  @ManyToOne(() => UserProfileEntity, (userProfile) => userProfile.userTasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserProfileEntity;

  /**
   * it creates relation between user task and task state
   */
  @Column({ type: 'uuid' })
  stateId: string;
  @OneToMany(() => TaskStateEntity, (taskState) => taskState.userTask, { cascade: true })
  states: TaskStateEntity[];
}
