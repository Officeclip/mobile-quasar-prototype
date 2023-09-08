export interface ExpenseDetails {
  id: number;
  accountName: string;
  accountSid: string;
  amount: number;
  billable: boolean;
  comments: string;
  description: string;
  employeeFullName: string;
  employeeSid: string;
  expenseDate: string;
  expenseDetailSid: string;
  expenseSid: string;
  expenseTypeName: string;
  expenseCategoryName: string;
  expenseTypeSid: string;
  projectName: string;
  projectSid: string;
  tax: number;
  paymentType: string;
}
