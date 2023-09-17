export interface ContactLists {
  meetingAttendees: MeetingAttendee[];
  labels: Label[];
}

export interface MeetingAttendee {
  name: string;
  email: string;
}

export interface Label {
  id: number;
  name: string;
  color: string;
}
