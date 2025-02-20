import { security } from '../security';

export interface TimeOffSummary {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  stageId: number;
  employeeId: string;
  createdByUserName: string;
  totalHours: number;
  payroll: {
    id: string;
    name: string;
  };
  security: security;
}
