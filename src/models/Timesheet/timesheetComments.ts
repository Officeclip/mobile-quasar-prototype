export interface TimesheetComments {
  timesheetId: string;
  isDcaa: boolean;
  users: Comments[];
}

export interface Comments {
  id: string;
  comment: string;
  createdBy: string;
  createdDate: string;
}
