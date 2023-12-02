export interface profileLists {
  organizations: Organization[];
  applications: Application[];
  regionalSettings: RegionalSettings;
  profiles: Profiles;
}

export interface Application {
  id: number;
  name: string;
}

export interface Organization {
  id: number;
  name: string;
}

export interface Profiles {
  user: User;
  group: Group;
}

export interface Group {
  timesheet: NameValue[];
}

export interface NameValue {
  name: string;
  value: string;
}

export interface User {
  general: NameValue[];
  timesheet: NameValue[];
}

export interface RegionalSettings {
  shortDateFormat: string;
}
