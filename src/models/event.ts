export interface Event {
  id: number;
  parentObjectServiceType: number;
  parentObjectId: number;
  eventType: number;
  eventName: string;
  eventDescription?: string;
  startDateTime: string;
  endDateTime: string;
  isAllDayEvent: boolean;
  eventLocation?: string;
}
