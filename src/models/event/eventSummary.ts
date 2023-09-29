export interface eventSummary {
  id: string;
  eventType: string;
  eventName: string;
  startDateTime?: string;
  endDateTime?: string;
  isAllDayEvent: boolean;
}
