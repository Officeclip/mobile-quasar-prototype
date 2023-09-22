export interface eventLists {
  labels: label[];
  regardingContacts: regardingContact[]
}

export interface label {
  id: number;
  name: string;
  color: string;
}

export interface regardingContact {
  id: string;
  name: string;
}
