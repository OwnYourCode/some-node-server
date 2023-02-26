import { Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<any>;
};

export const mockRepository: () => MockType<Repository<any>> = jest.fn(() => ({
  find: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
}));
