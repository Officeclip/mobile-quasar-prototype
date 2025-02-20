import { security } from '../security';
import { Comments } from '../teComments';
export interface TimeOffDetails {
  id: string;
  description: string;
  // status: {
  //   id: string;
  //   name: string;
  // };
  startDate: string;
  startTime: string;
  endDate: string;
  datesRequested: [];
  totalHours: number;
  createdUserSid: string;
  createdDate: string;
  createdByUserName: string;
  payroll: {
    id: string;
    name: string;
  };
  comments: Comments[];
  security: security;
}
