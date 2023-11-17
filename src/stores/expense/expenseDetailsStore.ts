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
import { expenseSummary } from 'src/models/expense/expenseSummary';
import axios from 'axios';
import { Constants } from 'stores/Constants';

export const useExpenseDetailsStore = defineStore('expensesDetailsStore', {
  state: () => ({
    expenseSummary: [] as expenseSummary[],
    expenseDetailsList: [] as expenseDetails[],
    //expenseDetails: [] as expenseDetails[],
    expenseDetails: undefined as expenseDetails | undefined,
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
    // isLoading: false,
  }),

  getters: {
    ExpenseSummary: (state) => state.expenseSummary,
    ExpenseDetailsList: (state) => state.expenseDetailsList,
    ExpenseDetails: (state) => state.expenseDetails,
    AirTravelExpense: (state) => state.airTravelExpense,
    AutoRentalExpense: (state) => state.autoRentalExpense,
    HotelExpense: (state) => state.hotelExpense,
    MileageExpense: (state) => state.mileageExpense,
    TaxiExpense: (state) => state.taxiExpense,
    TelephoneExpense: (state) => state.telephoneExpense,
    // IsLoading: (state) => state.isLoading,
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
      // this.isLoading = true;
      console.log(
        'expenseDetailsStore.ts > getExpenseDetailById - started: ',
        id
      );
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-details?id=${id}`
        );
        //console.log(`response.data[0]: ${response.data}`);
        if (response.data && response.data.length > 0) {
          //this.expenseDetails = JSON.parse(JSON.stringify(response.data[0])); // see: https://stackoverflow.com/a/69204006/89256
          this.expenseDetails = response.data[0]; // see: https://stackoverflow.com/a/69204006/89256
          console.log(
            `expenseDetailStore - getExpenseDetailById - expenseDetails: ${this.expenseDetails}`
          );
        }
      } catch (error) {
        alert(error);
        console.log(error);
      } finally {
        // this.isLoading = false;
      }
      console.log('expenseDetailsStore.ts> getExpenseDetailById - ended');
    },

    getInOutboxList(status: string) {
      switch (status) {
        case 'Inbox':
          return `${Constants.endPointUrl}/expense-summary?status=Saved&&status=Approved&&status=Submitted&&status=Rejected`;
        case 'Outbox':
          return `${Constants.endPointUrl}/expense-summary?status=Pending`;
        case 'Archived':
          return `${Constants.endPointUrl}/expense-summary?status=Saved&&status=Approved&&status=Rejected`;
      }
    },

    // getting the expenses by status
    async getExpensesByStatus(status: string) {
      // const callStr =
      //   status != ''
      //     ? `${Constants.endPointUrl}/expense-summary?status=${status}`
      //     : `${Constants.endPointUrl}/expense-summary`;
      const callStr = this.getInOutboxList(status);
      try {
        const response = await axios.get(callStr ?? '');
        this.expenseSummary = response.data;
      } catch (error) {
        console.error(error);
      }
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
    async deleteExpenseDetail(id: string | undefined) {
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

    // to remove whole timesheet top level delete need to make it work
    async deleteExpense(id: string | string[]) {
      try {
        const response = await axios.delete(
          `${Constants.endPointUrl}/expense-summary/${id}`
        );

        if (response.status === 200) {
          // Assuming the response contains the updated timesheet details
          this.expenseDetails = response.data;
        }
      } catch (error) {
        console.error(`deleteExpense Error: ${error}`);
      }
    },
  },
});
