export interface eventLists {
  labels: label[];
  // timeZones: timeZone[];
  showTimeAs: showTimeAs[];
  regardingParent: regardingParent[];
  users: user[];
}

export interface label {
  id: string;
  name: string;
  color: string;
}
export interface showTimeAs {
  id: string;
  name: string;
  color: string;
}

// export interface timeZone {
//   id: string;
//   name: string;
// }

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
