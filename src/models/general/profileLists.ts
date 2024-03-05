export interface profileLists {
  organizations: Organization[];
  regionalSettings: RegionalSettings;
  profiles: Profiles;
}

export interface Organization {
  id: string;
  name: string;
}

export interface Profiles {
  user: User;
  group: Group;
}

export interface Group {
  timesheet: GroupTimesheet;
}

export interface User {
  general: UserGeneral;
}

export interface UserGeneral {
  userIcon: string;
  userPhoto: string;
}

export interface GroupTimesheet {
  mode: string;
  periodicity: string;
  timesheetHeader: string;
  timesheetFooter: string;
  showPayrollColumn: string;
  timesheetStartDay: string;
}

export interface RegionalSettings {
  shortDateFormat: string;
}
