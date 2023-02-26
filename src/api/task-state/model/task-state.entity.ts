import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { TaskState } from './task-state.enum';
import { UserTaskEntity } from '../../user-task/model/user-task.entity';
import { CommonEntity } from '../../../shared/interfaces/common-entity';

@Entity({ name: 'taskState' })
export class TaskStateEntity extends CommonEntity {
  @Column({ type: 'enum', enum: TaskState, default: TaskState.PENDING, unique: true })
  name: TaskState;

  @ManyToOne(() => UserTaskEntity, (userTask) => userTask.states, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  userTask: UserTaskEntity;
}
