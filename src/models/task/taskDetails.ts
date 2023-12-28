import {security} from "src/models/security";
import {subTask} from "src/models/task/subtask";

export interface taskDetails {
  actualDuration: number;
  completionDate: string ;
  description: string;
  dueDate: string;
  estimatedDuration: number;
  isLock: boolean;
  isPrivate: boolean;
  parent: {
    type: {
      id: string;
      name: string;
    };
    value: {
      id: string;
      name: string;
    };
  };
  id: string|number;
  startDate: string;
  subject: string;
  taskOwnerName: string;
  taskOwnerSid: string;
  taskPriorityName: string;
  taskPriorityId: number;
  taskStatusName: string;
  taskStatusId: number;
  taskStatusCategory: string;
  taskTypeName: string;
  taskTypeId: number;
  assignees: assignee[];
  tags: tag[];
  createdByUserSid: string;
  createdDate: string;
  modifiedByUserSid: string;
  modifiedDate: string;
  subTasks: subTask[];
  security: security;

  remindTo: string,
  remindBeforeMinutes: number,
  repeatInfoText: string,
  recurrenceRule: string
}

export interface assignee {
  id: string;
  name: string;
  email: string;
}

export interface tag {
  id: string;
  name: string;
}
