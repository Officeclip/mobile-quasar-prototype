import { defineStore } from 'pinia';
import { Expense } from '../models/expense';
import {
  airTravelExpense,
  expenseDetails,
} from '../models/expense/expenseDetails';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util';

export const useExpensesStore = defineStore('expensesStore', {
  state: () => ({
    expenses: [] as Expense[],
    expense: undefined as Expense | undefined,
    expenseDetails: [] as expenseDetails[],
    expenseDetail: undefined as expenseDetails | undefined,
    airTravelExpense: undefined as airTravelExpense | undefined,
  }),

  getters: {
    Expenses: (state) => state.expenses,
    Expense: (state) => state.expense,
    ExpenseDetails: (state) => state.expenseDetails,
    ExpenseDetail: (state) => state.expenseDetail,
  },

  actions: {
    // getting all the timesheets for testing only, probably no where this use
    async getExpenses() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/expense-summary`
        );
        this.expenses = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    getExpensesCount(status: string) {
      this.getExpenses();
      if (this.expenses) {
        const newData = this.expenses.filter((t) => {
          return t.status == status;
        });
        return newData.length;
      } else {
        return [];
      }
    },
    // getting the timesheets by status
    async getExpensesByStatus(status: string) {
      const callStr =
        status != ''
          ? `${util.getEndPointUrl()}/expense-summary?status=${status}`
          : `${util.getEndPointUrl()}/expense-summary`;

      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.expenses = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getExpenseDetails(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/expense-detail?id=${id}`
        );
        this.expenseDetails = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getAirTravelExpenseType(airTravelExpense: airTravelExpense) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/expense-detail?expenseType=${airTravelExpense}`
        );
        this.airTravelExpense = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async addExpense(expenseDetail: expenseDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${util.getEndPointUrl()}/expense-detail`,
          expenseDetail
        );
        if (response.status === 200) {
          this.expenseDetail = response.data;
        }
      } catch (error) {
        console.error(`editExpense Error: ${error}`);
      }
    },

    async editExpense(expenseDetail: expenseDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${util.getEndPointUrl()}/expense-detail/${expenseDetail.id}`,
          expenseDetail
        );
        if (response.status === 200) {
          this.expenseDetail = response.data;
        }
      } catch (error) {
        console.error(`editExpense Error: ${error}`);
      }
    },
    async deleteExpense(id: string | undefined) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${util.getEndPointUrl()}/expense-detail/${id}`
        );
        if (response.status === 200) {
          this.expense = response.data;
        }
      } catch (error) {
        console.error(`deleteExpense Error: ${error}`);
      }
    },
  },
});
