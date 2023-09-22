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
  id: string;
  expenseTypeName: string;
  expenseName: string;
  isDetailsRequired: boolean;
  isBillable: boolean;
  isBillableModify: boolean;
}

export interface period {
  end: Date;
  name: string;
  start: Date;
}

export interface paymentType {
  label: string;
  value: number;
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
