export interface eventLists {
  labels: label[];
  regardingContacts: regardingContact[];
  timeZones: timeZone[];
  ShowTimeAs: ShowTimeAs[];
}

export interface label {
  id: string;
  name: string;
  color: string;
}
export interface ShowTimeAs {
  id: string;
  name: string;
  color: string;
}

export interface regardingContact {
  id: string;
  name: string;
}

export interface timeZone {
  id: string;
  name: string;
}
