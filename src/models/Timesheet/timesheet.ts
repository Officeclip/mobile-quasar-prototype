export interface Timesheet {
  id: string;
  totalHours: number;
  createdByUserName: string;
  employeeId: string;
  status: string;
  fromDate: string;
  readOnly: boolean;
}
