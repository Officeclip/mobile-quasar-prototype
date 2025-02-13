import { security } from '../security';
import { Comments } from '../teComments';
export interface TimeOffDetails {
  id: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  datesRequested: [];
  totalHours: number;
  createdDate: string;
  createdUserSid: string;
  createdBy: string;
  modifiedDate: string;
  modifiedUserSid: string;
  payrollName: string;
  payrollSid: string;
  comments: Comments[];
  status: string;
  security: security;
}
