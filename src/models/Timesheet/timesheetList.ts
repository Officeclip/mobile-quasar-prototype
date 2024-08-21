// created using https://app.quicktype.io/
export interface TimesheetList {
  periods: Period[];
  customerProjects: CustomerProject[];
  serviceItems: ServiceItem[];
  payrolls?: Payroll[];
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

export interface Payroll {
  name: string;
  id: number;
}

export interface Period {
  end: Date;
  name: string;
  start: Date;
  error: string;
  warning: string;
}

export interface ServiceItem {
  code: string;
  customerProjectId: string;
  id: string;
  isBillable: boolean;
  isBillableModify: boolean;
  name: string;
}
