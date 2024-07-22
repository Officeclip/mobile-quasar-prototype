import { security } from '../security';

export interface expenseSummary {
  id: string;
  totalAmount: number;
  currency: string;
  createdByUserName: string;
  employeeId: string;
  readOnly: boolean;
  status: string;
  fromDate: string;
  stageId: number;
  mode: string;
  security: security;
}
