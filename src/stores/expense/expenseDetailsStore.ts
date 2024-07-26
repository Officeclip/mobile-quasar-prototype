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
import { Constants } from 'stores/Constants';

export const useExpenseDetailsStore = defineStore('expensesDetailsStore', {
  state: () => ({
    expenseSummary: [] as expenseSummary[],
    expenseDetailsList: [] as expenseDetails[],
    expenseDetails: undefined as expenseDetails | undefined,
    airTravelExpense: undefined as airTravelExpense | undefined,
    autoRentalExpense: undefined as autoRentalExpense | undefined,
    hotelExpense: undefined as hotelExpense | undefined,
    mileageExpense: undefined as mileageExpense | undefined,
    taxiExpense: undefined as taxiExpense | undefined,
    telephoneExpense: undefined as telephoneExpense | undefined,
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
  },

  actions: {
    async getExpenseDetails(expenseSid: string | string[], stageId: number) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/expense-detail?expenseSid=${expenseSid}&stageId=${stageId}`
        );
        console.log('Getting Id', expenseSid);
        this.expenseDetailsList = response.data;
        console.log(this.expenseDetailsList);
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getExpenseDetailById(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/expense-detail/${id}`
        );
        if (response.data) {
          // see: https://stackoverflow.com/a/69204006/89256
          this.expenseDetails = response.data;
          console.log(
            `expenseDetailStore - getExpenseDetailById - expenseDetails: ${this.expenseDetails}`
          );
        }
      } catch (error) {
        // alert(error);
        // console.log(error);
        Constants.throwError(error);
      }
    },

    getInOutboxList(status: string) {
      try {
        let completeUrl = '';
        switch (status) {
          case 'Inbox':
            completeUrl = `${Constants.endPointUrl}/expense-summary?status=Saved&status=Approved&status=Submitted&status=Rejected`;
            break;
          case 'Outbox':
            completeUrl = `${Constants.endPointUrl}/expense-summary?status=None&status=Pending`;
            break;
          case 'Archived':
            completeUrl = `${Constants.endPointUrl}/expense-summary?status=Saved&status=Approved&status=Rejected`;
            break;
        }
        return completeUrl;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getExpensesByStatus(status: string) {
      const callStr = `${Constants.endPointUrl}/expense-summary?category=${status}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr ?? '');
        this.expenseSummary = response.data.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async addExpense(expenseDetails: expenseDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${Constants.endPointUrl}/expense-detail`,
          expenseDetails
        );
        if (response.status === 200) {
          this.expenseDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async editExpense(expenseDetails: expenseDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${Constants.endPointUrl}/expense-detail/${expenseDetails.id}`,
          expenseDetails
        );
        if (response.status === 200) {
          this.expenseDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async deleteExpenseDetail(id: string | undefined) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/expense-detail/${id}`
        );
        if (response.status === 200) {
          this.expenseDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async deleteExpense(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/expense-summary/${id}`
        );
        if (response.status === 200) {
          this.expenseDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
