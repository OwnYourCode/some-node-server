import { TaskResponseDto } from '../../../api/task/dto/task.response.dto';

export const createTaskDto1: TaskResponseDto = {
  name: 'Create table <UserProfile>',
  description: 'Create table UserProfile in database with fields: firstName, lastName',
  deadlineDate: '2021-08-25',
  startDate: '2021-08-22',
  createdAt: '2021-08-22',
  updatedAt: '2021-08-22',
};

export const createTaskDto2: TaskResponseDto = {
  name: 'Create table <Task>',
  description: 'Create table Task in database with fields: name, description',
  deadlineDate: '2021-08-25',
  startDate: '2021-08-29',
  createdAt: '2021-08-29',
  updatedAt: '2021-08-29',
};

export const createTaskDto3: TaskResponseDto = {
  name: 'Create table <UserTask>',
  description: 'Create table UserTask in database with fields: taskName, description, startDate, deadline',
  deadlineDate: '2021-08-29',
  startDate: '2021-09-02',
  createdAt: '2021-09-02',
  updatedAt: '2021-09-02',
};

export const createTaskDto4: TaskResponseDto = {
  name: 'Create table <TaskState>',
  description: 'Create table TaskState in database with fields: id, state, description',
  deadlineDate: '2021-09-22',
  startDate: '2021-09-05',
  createdAt: '2021-09-05',
  updatedAt: '2021-09-05',
};

export const tasksStub = [createTaskDto1, createTaskDto2, createTaskDto3, createTaskDto4];
