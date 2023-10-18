import { defineStore } from 'pinia';
import {
  airTravelExpense,
  autoRentalExpense,
  hotelExpense,
  mileageExpense,
  taxiExpense,
  telephoneExpense,
  expenseDetails,
} from '../../models/expense/expenseDetails';
import axios from 'axios';
import {Constants} from "stores/Constants";

export const useExpenseDetailsStore = defineStore('expensesDetailsStore', {
  state: () => ({
    expenseDetailsList: [] as expenseDetails[],
    expenseDetails: [] as expenseDetails[],
    //expenseDetails: undefined as expenseDetails | undefined,
    //expenseDetails: [],
    airTravelExpense: undefined as airTravelExpense | undefined,
    //airTravelExpense: [],
    autoRentalExpense: undefined as autoRentalExpense | undefined,
    //autoRentalExpense: [],
    hotelExpense: undefined as hotelExpense | undefined,
    mileageExpense: undefined as mileageExpense | undefined,
    taxiExpense: undefined as taxiExpense | undefined,
    telephoneExpense: undefined as telephoneExpense | undefined,

    // expenseDetails: [] as ExpenseDetail[],
    // expenseDetail: undefined as ExpenseDetail | undefined,
  }),

  getters: {
    ExpenseDetailsList: (state) => state.expenseDetailsList,
    ExpenseDetails: (state) => state.expenseDetails,
    AirTravelExpense: (state) => state.airTravelExpense,
    AutoRentalExpense: (state) => state.autoRentalExpense,
    HotelExpense: (state) => state.hotelExpense,
    MileageExpense: (state) => state.mileageExpense,
    TaxiExpense: (state) => state.taxiExpense,
    TelephoneExpense: (state) => state.telephoneExpense,
  },

  actions: {
    async getExpenseDetails(expenseSid: string | string[]) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-details?expenseSid=${expenseSid}`
        );
        console.log('Getting Id', expenseSid);
        this.expenseDetailsList = response.data;
        console.log(this.expenseDetailsList);
      } catch (error) {
        console.error(error);
      }
    },

    async getExpenseDetailById(id: string | string[]) {
      console.log(
        'expenseDetailsStore.ts > getExpenseDetailById - started: ',
        id
      );
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-details?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.expenseDetails = response.data[0];
          console.log(
            `expenseDetailStore - getExpenseDetailById - expenseDetails: ${this.expenseDetails}`
          );
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
      console.log('expenseDetailsStore.ts> getExpenseDetailById - ended');
    },

    async addExpense(expenseDetails: expenseDetails) {
      try {
        const response = await axios.post(
          `${Constants.endPointUrl}/expense-details`,
          expenseDetails
        );
        if (response.status === 200) {
          //debugger;
          this.expenseDetails = response.data;
        }
      } catch (error) {
        console.error(`editExpense Error: ${error}`);
      }
    },

    async editExpense(expenseDetails: expenseDetails) {
      //console.log(`editExpense 1: ${this.expenseDetails?.id}`);
      // not added yet
      try {
        const response = await axios.put(
          `${Constants.endPointUrl}/expense-details/${expenseDetails.id}`,
          expenseDetails
        );
        if (response.status === 200) {
          //debugger;
          this.expenseDetails = response.data;
        }
      } catch (error) {
        console.error(`editExpense Error: ${error}`);
      }
    },
    async deleteExpense(id: string | undefined) {
      try {
        const response = await axios.delete(
          `${Constants.endPointUrl}/expense-details/${id}`
        );
        if (response.status === 200) {
          //debugger;
          this.expenseDetails = response.data;
        }
      } catch (error) {
        console.error(`deleteExpense Error: ${error}`);
      }
    },
  },
});
