import { DateTime } from 'rrule/dist/esm/datetime';
import { security } from '../security';
export interface eventSummary {
  id: string;
  eventType: string;
  eventName: string;
  startDateTime?: string;
  startDate: Date;
  endDate: Date;
  endDateTime?: string;
  isAllDayEvent: boolean;
  security: security[];
}
