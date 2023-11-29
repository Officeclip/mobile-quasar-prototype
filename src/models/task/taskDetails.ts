import { subTask } from "src/models/task/subtask";
import {security} from "src/models/security";

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
  taskStatus: {
    id: string;
    name: string;
  };
  parentObject: {
    id: number;
    serviceType: number;
  };
  taskOwner: {
    name: string;
    sid: number;
  };
  taskPriority: {
    id: string;
    name: string;
  };
  taskType: {
    id: string;
    name: string;
  };
  remindTo: string;
  remindBeforeMinutes: number;
  repeatInfoText: string;
  recurrenceRule: string;
  tags: tag[];
  subtasks: subTask[];
  security: security

}

export interface assignee {
  id: string;
  name: string;
}

export interface tag {
  id: string;
  name: string;
}
