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
import util from 'src/helpers/util';

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
    errorMsg: '' as string,
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
          `${util.endPointUrl()}/expense-detail?expenseSid=${expenseSid}&stageId=${stageId}`
        );
        this.expenseDetailsList = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getExpenseDetailById(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.endPointUrl()}/expense-detail/${id}`
        );
        if (response.data) {
          // see: https://stackoverflow.com/a/69204006/89256
          this.expenseDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    getInOutboxList(status: string) {
      try {
        let completeUrl = '';
        switch (status) {
          case 'Inbox':
            completeUrl = `${util.endPointUrl()}/expense-summary?status=Saved&status=Approved&status=Submitted&status=Rejected`;
            break;
          case 'Outbox':
            completeUrl = `${util.endPointUrl()}/expense-summary?status=None&status=Pending`;
            break;
          case 'Archived':
            completeUrl = `${util.endPointUrl()}/expense-summary?status=Saved&status=Approved&status=Rejected`;
            break;
        }
        return completeUrl;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getExpensesByStatus(status: string) {
      const callStr = `${util.endPointUrl()}/expense-summary?category=${status}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr ?? '');
        this.expenseSummary = response.data.data;
        if (response.status === 204) {
          this.errorMsg = response.statusText;
          return true;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async addExpense(expenseDetails: expenseDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${util.endPointUrl()}/expense-detail`,
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
          `${util.endPointUrl()}/expense-detail/${expenseDetails.id}`,
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
          `${util.endPointUrl()}/expense-detail/${id}`
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
          `${util.endPointUrl()}/expense-summary/${id}`
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
