// export interface TEComments {
//   timesheetId: string;
//   isDcaa: boolean;
//   users: Comments[];
// }

export interface Comments {
  id: string;
  itemId: string;
  html_comment: string;
  text_comment: string;
  commentedUserName: string;
  commentedDate: string;
  commentedUserSid: string;
}

export interface TimesheetDCAA {
  mode: string;
  periodicity: string;
  timesheetHeader: string;
  timesheetFooter: string;
  showPayrollColumn: boolean;
  timesheetStartDay: string;
  dcaa: DCAA[];
}

export interface DCAA {
  isEnabled: boolean;
  relaxation: number;
  isConfirmationRequiredToSubmit: boolean;
  confirmationMessage: string;
}
