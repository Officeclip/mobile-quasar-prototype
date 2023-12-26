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
  id: string;
  startDate: string;
  subject: string;
  taskOwnerName: string;
  taskOwnerSid: string;
  taskPriorityName: string;
  taskPriorityId: number;
  taskStatusName: string;
  taskStatusId: number;
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

// The assignee interface remains the same
export interface assignee {
  id: string;
  name: string;
  email: string;
}

// The tag interface remains the same
export interface tag {
  id: string;
  name: string;
}

// The subTask interface needs to be modified as follows



// import { subTask } from "src/models/task/subtask";
// import {security} from "src/models/security";
// import {regarding} from "src/models/general/regardingItem";
//
// export interface taskDetails {
//   id: number;
//   subject: string;
//   description: string;
//   createdDate: string;
//   startDate: string;
//   dueDate: string;
//   modifiedDate: string;
//   parent: regarding;
//   assignees: assignee[];
//   isPrivate: boolean;
//   taskStatus: {
//     id: string;
//     name: string;
//   };
//   parentObject: {
//     id: number;
//     serviceType: number;
//   };
//   taskOwner: {
//     name: string;
//     sid: number;
//   };
//   taskPriority: {
//     id: string;
//     name: string;
//   };
//   taskType: {
//     id: string;
//     name: string;
//   };
//   remindTo: string;
//   remindBeforeMinutes: number;
//   repeatInfoText: string;
//   recurrenceRule: string;
//   tags: tag[];
//   subTasks: subTask[];
//   security: security
//
// }
//
// export interface assignee {
//   id: string;
//   name: string;
// }
//
// export interface tag {
//   id: string;
//   name: string;
// }
