import {subTask} from "src/models/task/subtask";

export interface taskDetails {
  id: number;
  subject: string;
  description: string;
  createdDate: string;
  startDate: string;
  dueDate: string;
  modifiedDate: string;
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
  subtasks: subTask[];
}
