export interface EventDetails {
  sid: string;
  createdDate: string;
  createdGroupSId: string;
  createdUserSid: string;
  parentServiceType: number;
  parentSid: string;
  eventType: number;
  eventName: string;
  eventDescription?: string;
  startDateTime: string;
  endDateTime: string;
  isAllDayEvent: boolean;
  eventLocation?: string;
  eventUserSid: string;
  isRsvp: boolean;
  repeatInfoText: string;
  recurrenceRule: string;
  modifiedDate: string;
  modifiedUserSid: string;
  timezoneId: string;
  remindTo: string;
  remindBeforeMinutes: number;
}
