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
}

export interface ServiceItem {
  code: string;
  customerProjectId: string;
  id: string;
  isBillable: boolean;
  name: string;
}

// Converts JSON strings to/from your types
/* export class Convert {
  public static toTimesheetList(json: string): TimesheetList[] {
      return JSON.parse(json);
  }

  public static timesheetListToJson(value: TimesheetList[]): string {
      return JSON.stringify(value);
  }
} */
