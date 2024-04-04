// created using https://app.quicktype.io/
// To parse this data:
//
//   import { Convert, ExpenseLists } from "./file";
//
//   const expenseLists = Convert.toExpenseLists(json);

export interface expenseLists {
  periods: period[];
  customerProjects: customerProject[];
  expenseTypes: expenseType[];
  paymentTypes: paymentType[];
}

export interface customerProject {
  id: string;
  name: string;
}

export interface expenseType {
  expenseTypeSid: string;
  expenseTypeName: string;
  expenseName: string;
  isDetailsRequired: boolean;
  isBillable: boolean;
  isBillableModify: boolean;
  isActive: boolean;
}

export interface period {
  end: Date;
  name: string;
  start: Date;
  error: string;
  warning: string;
}

export interface paymentType {
  label: string;
  value: string;
}

// Converts JSON strings to/from your types
/* export class Convert {
  public static toExpenseLists(json: string): ExpenseLists {
      return JSON.parse(json);
  }

  public static expenseListsToJson(value: ExpenseLists): string {
      return JSON.stringify(value);
  }
} */
