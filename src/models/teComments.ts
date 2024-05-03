export interface TEComments {
  timesheetId: string;
  isDcaa: boolean;
  users: Comments[];
}

export interface Comments {
  id: string;
  itemId: string;
  html_comment: string;
  text_comment: string;
  commentedUserName: string;
  commentedDate: string;
  commentedUserSid: string;
}
