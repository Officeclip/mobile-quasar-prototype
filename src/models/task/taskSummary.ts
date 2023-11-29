import {security} from "src/models/security";

export interface taskSummary {
  id: number;
  subject: string;
  dueDate: string;
  isPrivate: boolean;
  taskStatusName: string;
  taskPriorityName: string;
  security: security
}


