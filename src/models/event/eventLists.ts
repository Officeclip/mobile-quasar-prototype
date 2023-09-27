export interface eventLists {
  labels: label[];
  regardingContacts: regardingContact[];
  timeZones: timeZone[];
}

export interface label {
  id: string;
  name: string;
  color: string;
}

export interface regardingContact {
  id: string;
  name: string;
}

export interface timeZone {
  id: number;
  name: string;
}
