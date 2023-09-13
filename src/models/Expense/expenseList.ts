// created using https://app.quicktype.io/
export interface TimesheetList {
  periods: Period[];
  customerProjects: CustomerProject[];
  customFields?: CustomField[];
}

export interface CustomField {
  fieldType: string;
  id: number;
  items: string[];
  name: string;
  uiType: string;
}

export interface CustomerProject {
  id: string;
  name: string;
}

export interface Period {
  end: Date;
  name: string;
  start: Date;
}
