import { security } from '../security';
import { Comments } from '../teComments';
export interface TimeOffDetails {
  id: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  requestedFor: string;
  datesRequested: [];
  totalHours: number;
  totalDays: number;
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
