import { security } from 'src/models/security';
import { subTask } from 'src/models/task/subtask';

export interface taskDetails {
  actualDuration: number;
  completionDate: string;
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
  id: string;
  startDate: string;
  subject: string;
  taskOwnerName: string;
  taskOwnerSid: string;
  taskPriorityName: string;
  taskPriorityId: string;
  taskStatusName: string;
  taskStatusId: string;
  taskStatusCategory: string;
  taskTypeName: string;
  taskTypeId: string;
  assignees: assignee[];
  tags: tag[];
  createdByUserSid: string;
  createdDate: string;
  modifiedByUserSid: string;
  modifiedDate: string;
  subTasks: subTask[];
  security: security;
  reminder: {
    to: string;
    beforeMinutes: number;
  };
  //remindTo: string;
  //remindBeforeMinutes: number;
  recurrence: {
    text: string;
    rule: string;
  };
  //repeatInfoText: string;
  //recurrenceRule: string;
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
