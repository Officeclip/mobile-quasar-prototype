// To parse this data:
//
//   import { Convert, ExpenseDetail } from "./file";
//
//   const expenseDetail = Convert.toExpenseDetail(json);

// From: https://app.quicktype.io/#l=TypeScript

export interface ExpenseDetail {
  accountName: string;
  accountSid: string;
  amount: number;
  billable: boolean;
  comments: string;
  description: string;
  employeeFullName: string;
  employeeSid: string;
  expenseDate: Date;
  expenseDetailSid: string;
  expenseSid: string;
  expenseTypeName: string;
  expenseCategoryName: string;
  expenseTypeSid: string;
  projectName: string;
  projectSid: string;
  tax: number;
  paymentType: string;
  autoRentalExpense?: AutoRentalExpense;
  airTravelExpense?: AirTravelExpense;
  hotelExpense?: HotelExpense;
  mileageExpense?: MileageExpense;
  telephoneExpense?: TelephoneExpense;
  taxiExpense?: TaxiExpense;
}

export interface AirTravelExpense {
  arrivalAirport: string;
  arrivalDate: string;
  departureAirport: string;
  departureDate: string;
}

export interface AutoRentalExpense {
  rentalAgency: string;
  city: string;
  fromDate: string;
  toDate: string;
}

export interface HotelExpense {
  hotelName: string;
  city: string;
  fromDate: string;
  toDate: string;
}

export interface MileageExpense {
  mileage: string;
}

export interface TaxiExpense {
  city: string;
  taxiLineName: string;
}

export interface TelephoneExpense {
  phoneNumber: string;
  city: string;
}

// Converts JSON strings to/from your types
/* export class Convert {
  public static toExpenseDetail(json: string): ExpenseDetail {
    return JSON.parse(json);
  }

  public static expenseDetailToJson(value: ExpenseDetail): string {
    return JSON.stringify(value);
  }
}
 */
