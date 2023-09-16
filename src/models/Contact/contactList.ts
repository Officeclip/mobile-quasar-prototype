export interface ContactList {
  states: State[];
  countries: Country[];
}

export interface State {
  name: string;
  code: string;
}

export interface Country {
  name: string;
  code: string;
}
