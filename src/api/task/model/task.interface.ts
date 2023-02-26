export interface ITaskFields {
  name: string;
  description: string;
}

export interface ITask extends ITaskFields {
  startDate: string;
  deadlineDate: string;
  assignedUsers?: string[];
}
