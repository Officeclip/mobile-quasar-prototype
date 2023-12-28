export interface ContactLists {
  states: State[];
  countries: Country[];
  children: Children[];
}

export interface State {
  name: string;
  id: string;
  is_default: boolean;
}

export interface Country {
  name: string;
  id: string;
  is_default: boolean;
}

export interface Children {
  id: number;
  name: string;
}
