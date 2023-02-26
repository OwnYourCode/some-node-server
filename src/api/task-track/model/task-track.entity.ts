import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserTaskEntity } from '../../user-task/model/user-task.entity';
import { CommonEntity } from '../../../shared/interfaces/common-entity';

@Entity({ name: 'taskTrack' })
export class TaskTrackEntity extends CommonEntity {
  @Column({ type: 'date' })
  date: string;

  @Column({ length: 250, nullable: true })
  note?: string;

  @Column()
  userTaskId: string;
  /**
   * it creates relation between task track userTaskId and user task userTaskId
   */
  @ManyToOne(() => UserTaskEntity, (userTask) => userTask.taskTracks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userTaskId' })
  userTask: Promise<UserTaskEntity>;
}
