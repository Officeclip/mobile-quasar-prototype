import { security } from '../security';

export interface expenseSummary {
  id: string;
  totalAmount: number;
  createdByUserName: string;
  employeeId: string;
  status: string;
  fromDate: string;
  stageId: number;
  security: security[];
}
