// To parse this data:
//
//   import { Convert, EventDetails } from "./file";
//
//   const eventDetails = Convert.toEventDetails(json);
//
// From: https://app.quicktype.io/#l=TypeScript

import { security } from '../security';
import { label, ShowTimeAs } from './eventLists';

export interface eventDetails {
  id: string;
  createdDate: string;
  createdGroupSid: string;
  createdUserSid: string;
  createdUserName: string;
  parent: {
    type: idAndName;
    value: idAndName;
  };
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
  modifiedDate: string;
  modifiedUserSid: string;
  modifiedUserName: string;
  // timezoneId: timeZone[];
  reminder: reminder[];
  recurrence: recurrence[];
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

export interface idAndName {
  id: string;
  name: string;
}

export interface reminder {
  to: string;
  beforeMinutes: string;
}

export interface recurrence {
  text: string;
  rule: string;
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
