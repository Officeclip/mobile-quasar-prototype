export interface taskDetails {
  id: number;
  subject: string;
  description: string;
  createdDate: string;
  startDate: string;
  dueDate: string;
  regardingType: number;
  regardingValue: string;
  assignee: string[];
  isPrivate: boolean;
  taskStatusId: number;
  parentObjectId: number;
  parentObjectServiceType: number;
  taskOwner: string;
  taskOwnerSid: number;
  taskPriorityId: number;
  taskTypeId: number;
  remindTo: string;
  remindBeforeMinutes: number;
  repeatInfoText: string;
  recurrenceRule: string;
  tags:number[];
  subtasks: number[];
}
