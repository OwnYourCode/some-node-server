import { CreateTaskStateDto } from '../../../api/task-state/dto/create-task-state.dto';
import { TaskState } from '../../../api/task-state/model/task-state.enum';

export const taskState_1: CreateTaskStateDto = {
  name: TaskState.FAIL,
};
export const taskState_2: CreateTaskStateDto = {
  name: TaskState.SUCCESS,
};
export const taskState_3: CreateTaskStateDto = {
  name: TaskState.ACTIVE,
};
export const taskState_4: CreateTaskStateDto = {
  name: TaskState.PENDING,
};

export const taskStatesStub: CreateTaskStateDto[] = [taskState_1, taskState_2, taskState_3, taskState_4];
