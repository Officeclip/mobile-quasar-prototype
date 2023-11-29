export interface eventSummary {
  id: number;
  eventType: string;
  eventName: string;
  startDateTime?: string;
  endDateTime?: string;
  isAllDayEvent: boolean;
}
