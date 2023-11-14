export interface Timesheet {
  id: number;
  totalHours: number;
  createdByUserName: string;
  employeeId: string;
  status: string;
  fromDate: string;
  readOnly: boolean;
}
