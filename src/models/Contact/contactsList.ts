export interface ContactLists {
  states: State[];
  countries: Country[];
  children: Children[];
}

export interface State {
  name: string;
  code: string;
}

export interface Country {
  name: string;
  code: string;
}

export interface Children {
  id: number;
  name: string;
}
