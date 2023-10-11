export interface taskSummary {
  id: number;
  subject: string;
  description: string;
  createdDate: string;
  modifiedDate: string;
  startDate: string;
  dueDate: string;
  regardingType: number;
  regardingValue: string;
  assignee: string[];
  isPrivate: boolean;
  taskStatusId: string;
  parentObjectId: number;
  parentObjectServiceType: number;
  taskOwner: string;
  taskOwnerSid: number;
  taskPriorityId: string;
  taskTypeId: string;
  remindTo: string;
  remindBeforeMinutes: number;
  repeatInfoText: string;
  recurrenceRule: string;
  tags:number[];
  subtasks: number[];
}
