import { security } from '../security';
import { eventType } from './eventLists';
export interface eventSummary {
  id: string;
  eventType: eventType;
  eventName: string;
  startDateTime?: string;
  endDateTime?: string;
  isAllDayEvent: boolean;
  security: security;
}
