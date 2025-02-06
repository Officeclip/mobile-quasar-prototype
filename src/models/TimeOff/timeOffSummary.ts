import { security } from '../security';

export interface TimeOffSummary {
  createdByUserName: string;
  employeeId: string;
  id: string;
  status: string;
  totalHours: number;
  fromDate: string;
  toDate: string;
  stageId: number;
  security: security;
}
