export interface TimesheetDetails {
  id: string;
  timesheetId: string;
  timeDuration: number;
  isBillable: boolean;
  accountName: string;
  accountSid: string;
  breakTime: string;
  checkInTime: string;
  checkOutTime: string;
  createdDate: string;
  createdUserSid: string;
  description: string;
  comments: string;
  modifiedDate: string;
  modifiedUserSid: string;
  payrollName: string;
  payrollSid: string;
  projectName: string;
  projectSid: string;
  serviceItemName: string;
  serviceItemSid: string;
  taskDate: string;
  timesheetDetailSid: string;
}
