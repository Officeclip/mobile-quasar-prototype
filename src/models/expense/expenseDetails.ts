import { security } from '../security';

export interface expenseDetails {
  accountName: string;
  accountSid: string;
  amount: number;
  currency: string;
  billable: boolean;
  comments: string;
  description: string;
  employeeFullName: string;
  employeeSid: string;
  expenseDate: string;
  id: string;
  expenseSid: string;
  expenseTypeName: string;
  expenseCategoryName: string;
  expenseTypeSid: string;
  projectName: string;
  projectSid: string;
  tax: number;
  paymentType: string;
  autoRentalExpense: autoRentalExpense;
  airTravelExpense: airTravelExpense;
  hotelExpense: hotelExpense;
  mileageExpense: mileageExpense;
  telephoneExpense: telephoneExpense;
  taxiExpense: taxiExpense;
  security: security;
}

export interface airTravelExpense {
  arrivalAirport: string;
  arrivalDate: string;
  departureAirport: string;
  departureDate: string;
}

export interface autoRentalExpense {
  rentalAgency: string;
  city: string;
  fromDate: string;
  toDate: string;
}

export interface hotelExpense {
  hotelName: string;
  city: string;
  fromDate: string;
  toDate: string;
}

export interface mileageExpense {
  mileage: string;
}

export interface taxiExpense {
  city: string;
  taxiLineName: string;
}

export interface telephoneExpense {
  phoneNumber: string;
  city: string;
}
