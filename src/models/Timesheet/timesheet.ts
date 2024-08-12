import { security } from '../security';

export interface Timesheet {
  createdByUserName: string;
  employeeId: string;
  id: string;
  status: string;
  totalHours: number;
  fromDate: string;
  toDate: string;
  readOnly: boolean;
  stageId: number;
  mode: string;
  security: security;
}
