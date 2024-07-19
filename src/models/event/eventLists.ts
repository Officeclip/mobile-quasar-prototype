export interface eventLists {
  labels: label[];
  showTimeAs: showTimeAs[];
  regardingParent: regardingParent[];
  users: user[];
}

export interface label {
  id: string;
  name: string;
  backColor: string;
  foreColor: string;
  borderColor: string;
}

export interface showTimeAs {
  id: string;
  name: string;
}

export interface regardingParent {
  id: string;
  name: string;
}

export interface regardingContact {
  id: string;
  name: string;
}

export interface user {
  id: string;
  name: string;
}

export interface eventType {
  id: string;
  name: string;
}
