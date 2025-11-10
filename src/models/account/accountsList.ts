export interface AccountLists {
  states: State[];
  countries: Country[];
  children: Children[];
}

export interface State {
  name: string;
  id: number;
  is_default: boolean;
}

export interface Country {
  name: string;
  id: number;
  is_default: boolean;
}

export interface Children {
  id: number;
  name: string;
}
