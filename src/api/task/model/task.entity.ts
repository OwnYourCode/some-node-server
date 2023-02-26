import { Column, Entity, OneToMany } from 'typeorm';
import { UserTaskEntity } from '../../user-task/model/user-task.entity';
import { CommonEntity } from '../../../shared/interfaces/common-entity';

@Entity({ name: 'task' })
export class TaskEntity extends CommonEntity {
  @Column({ length: 50 })
  name: string;

  @Column({ length: 250, nullable: true })
  description: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  deadlineDate: string;

  /**
   * it creates relation between task taskId and user task taskId
   */
  @OneToMany(() => UserTaskEntity, (userTask) => userTask.task, {
    cascade: true,
  })
  userTasks: UserTaskEntity[];
}
