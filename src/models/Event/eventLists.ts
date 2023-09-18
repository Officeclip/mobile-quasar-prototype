export interface eventLists {
  meetingAttendees: meetingAttendee[];
  labels: label[];
}

export interface meetingAttendee {
  name: string;
  email: string;
}

export interface label {
  id: number;
  name: string;
  color: string;
}
