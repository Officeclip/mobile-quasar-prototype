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
  assignees: assignee[];
  isPrivate: boolean;
  taskStatusId: string;
  taskStatusName:string;
  parentObjectId: number;
  parentObjectServiceType: number;
  taskOwner: string;
  taskOwnerSid: number;
  taskPriorityId: string;
  taskPriorityName:string;
  taskTypeId: string;
  taskTypeName: string;
  remindTo: string;
  remindBeforeMinutes: number;
  repeatInfoText: string;
  recurrenceRule: string;
  tags: tag[];
  subtasks: subTask[];
}

export interface assignee {
  id: string;
  name: string;
}

export interface tag {
  id: string;
  name: string;
}
