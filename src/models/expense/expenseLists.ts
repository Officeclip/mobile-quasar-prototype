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
