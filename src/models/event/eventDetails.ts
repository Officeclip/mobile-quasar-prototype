// To parse this data:
//
//   import { Convert, EventDetails } from "./file";
//
//   const eventDetails = Convert.toEventDetails(json);
//
// From: https://app.quicktype.io/#l=TypeScript

import { label, timeZone } from './eventLists';

export interface eventDetails {
  id: string;
  createdDate: string;
  createdGroupSId: string;
  createdUserSid: string;
  parentServiceType: number;
  parentSid: string;
  eventType: number;
  eventName: string;
  eventDescription?: string;
  startDateTime?: string;
  endDateTime?: string;
  isAllDayEvent: boolean;
  eventUserSid: string;
  isRsvp: boolean;
  eventLocation?: string;
  repeatInfoText: string;
  recurrenceRule: string;
  modifiedDate: string;
  modifiedUserSid: string;
  timezoneId: timeZone[];
  remindTo: string;
  remindBeforeMinutes: number;
  label: label[];
  meetingAttendees: meetingAttendee[];
  url: string;
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
