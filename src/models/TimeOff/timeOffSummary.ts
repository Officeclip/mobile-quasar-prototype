import { security } from '../security';

export interface TimeOffSummary {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  datesRequested: [];
  stageId: number;
  employeeId: string;
  createdByUserName: string;
  totalHours: number;
  totalDays: number;
  payroll: {
    id: string;
    name: string;
  };
  security: security;
}
