// To parse this data:
//
//   import { Convert, EventDetails } from "./file";
//
//   const eventDetails = Convert.toEventDetails(json);
//
// From: https://app.quicktype.io/#l=TypeScript

import { label, ShowTimeAs, timeZone } from './eventLists';
import { security } from '../../models/security';

export interface eventDetails {
  id: number;
  createdDate: string;
  createdGroupSId: string;
  createdUserSid: string;
  createdUserName: string;
  parentServiceType: number;
  parentSid: string;
  eventType: string;
  eventName: string;
  eventDescription?: string;
  startDateTime?: string;
  endDateTime?: string;
  isAllDayEvent: boolean;
  eventUserSid: string;
  isRsvp: boolean;
  sendNotifications: boolean;
  eventLocation?: string;
  repeatInfoText: string;
  recurrenceRule: string;
  modifiedDate: string;
  modifiedUserSid: string;
  modifiedUserName: string;
  timezoneId: timeZone[];
  remindTo: string;
  remindBeforeMinutes: number;
  label: label[];
  ShowTimeAs: ShowTimeAs[];
  meetingAttendees: meetingAttendee[];
  url: string;
  security: security[];
}

export interface meetingAttendee {
  id: string;
  name: string;
  email: string;
}

// Converts JSON strings to/from your types
// export class Convert {
//   public static toEventDetails(json: string): EventDetails {
//       return JSON.parse(json);
//   }

//   public static eventDetailsToJson(value: EventDetails): string {
//       return JSON.stringify(value);
//   }
// }
