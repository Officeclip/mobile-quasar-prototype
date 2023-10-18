import { defineStore } from 'pinia';
import { Expense } from '../models/expense';
//import { ExpenseDetails } from '../models/expenseDetails';
import {
  airTravelExpense,
  expenseDetails,
} from '../models/expense/expenseDetails';
import axios from 'axios';
import {Constants} from "stores/Constants";

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
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-summary`
        );
        this.expenses = response.data;
        console.log(this.expense);
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
        console.log('QQQQQQQQQQQQQQQQ', newData);
        return newData.length;
      } else {
        return [];
      }
    },
    // getting the timesheets by status
    async getExpensesByStatus(status: string) {
      const callStr =
        status != ''
          ? `${Constants.endPointUrl}/expense-summary?status=${status}`
          : `${Constants.endPointUrl}/expense-summary`;

      try {
        const response = await axios.get(callStr);
        this.expenses = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getExpenseDetails(id: string | string[]) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-details?id=${id}`
        );
        this.expenseDetails = response.data;
        console.log(this.expenseDetails);
      } catch (error) {
        console.error(error);
      }
    },

    async getAirTravelExpenseType(airTravelExpense: airTravelExpense) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-details?expenseType=${airTravelExpense}`
        );
        this.airTravelExpense = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async addExpense(expenseDetail: expenseDetails) {
      try {
        const response = await axios.post(
          `${Constants.endPointUrl}/expense-details`,
          expenseDetail
        );
        if (response.status === 200) {
          //debugger;
          this.expenseDetail = response.data;
        }
      } catch (error) {
        console.error(`editExpense Error: ${error}`);
      }
    },

    async editExpense(expenseDetail: expenseDetails) {
      console.log(`editExpense 1: ${this.expenseDetail?.id}`);
      // not added yet
      try {
        const response = await axios.put(
          `${Constants.endPointUrl}/expense-details/${expenseDetail.id}`,
          expenseDetail
        );
        if (response.status === 200) {
          //debugger;
          this.expenseDetail = response.data;
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
          this.expense = response.data;
        }
      } catch (error) {
        console.error(`deleteExpense Error: ${error}`);
      }
    },
  },
});
