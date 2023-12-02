export interface ProfileInfo {
  organizations: Organization[];
  applications: Application[];
  regionalSettings: RegionalSettings;
  profiles: Profile;
}

export interface Application {
  id: number;
  Name: string;
}

export interface Organization {
  id: number;
  value: string;
}

export interface Profile {
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
