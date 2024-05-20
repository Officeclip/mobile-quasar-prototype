export interface taskSummary {
  id: number | string;
  subject: string;
  dueDate: string;
  isPrivate: boolean;
  taskStatusName: string;
  taskStatusCategory: string;
  taskPriorityName: string;
}
