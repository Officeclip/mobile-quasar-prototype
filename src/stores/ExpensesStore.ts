import { defineStore } from 'pinia';
import { Expense } from '../models/expense';
//import { ExpenseDetails } from '../models/expenseDetails';
import {
  AirTravelExpense,
  ExpenseDetail,
} from '../models/Expense/expenseDetail';
import axios from 'axios';

export const useExpensesStore = defineStore('expensesStore', {
  state: () => ({
    expenses: [] as Expense[],
    expense: undefined as Expense | undefined,

    expenseDetails: [] as ExpenseDetail[],
    expenseDetail: undefined as ExpenseDetail | undefined,

    airTravelExpense: undefined as AirTravelExpense | undefined,
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
          'http://localhost:4000/expense-summary'
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
          ? `http://localhost:4000/expense-summary?status=${status}`
          : 'http://localhost:4000/expense-summary';

      try {
        const response = await axios.get(callStr);
        this.expenses = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getExpenseDetails(id: string) {
      try {
        const response = await axios.get(
          `http://localhost:4000/expense-details?id=${id}`
        );
        this.expenseDetails = response.data;
        console.log(this.expenseDetails);
      } catch (error) {
        console.error(error);
      }
    },

    async getAirTravelExpenseType(airTravelExpense: AirTravelExpense) {
      try {
        const response = await axios.get(
          `http://localhost:4000/expense-details?expenseType=${airTravelExpense}`
        );
        this.airTravelExpense = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async addExpense(expenseDetail: ExpenseDetail) {
      try {
        const response = await axios.post(
          'http://localhost:4000/expense-details',
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

    async editExpense(expenseDetail: ExpenseDetail) {
      console.log(`editExpense 1: ${this.expenseDetail?.expenseDetailSid}`);
      // not added yet
      try {
        const response = await axios.put(
          `http://localhost:4000/expense-details/${expenseDetail.expenseDetailSid}`,
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
          `http://localhost:4000/expense-details/${id}`
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
