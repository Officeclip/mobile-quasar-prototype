export interface Task {
  id: number;
  subject: string;
  startDate: string;
  dueDate: string;
  createdDate: string;
  isPrivate: boolean;
  taskStatusName: string;
  description: string;
  parentObjectId: number;
  parentObjectServiceType: number;
  taskOwnerName: string;
  taskOwnerSid: number;
  taskPriorityName: string;
  taskTypeName: string;
}
