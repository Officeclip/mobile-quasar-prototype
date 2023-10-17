import { defineStore } from 'pinia';
import { expenseSummary } from '../../models/expense/expenseSummary';
import axios from 'axios';
import {Constants} from "stores/Constants";

export const useExpenseSummaryStore = defineStore('expenseSummaryStore', {
  state: () => ({
    expenseSummary: [] as expenseSummary[],
  }),

  getters: {
    ExpenseSummary: (state) => state.expenseSummary,
  },

  actions: {
    // getting all the timesheets for testing only, probably no where this use
    async getExpenseSummary() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-summary`
        );
        this.expenseSummary = response.data;
        console.log(this.expenseSummary);
      } catch (error) {
        console.error(error);
      }
    },

    getExpenseSummaryCount(status: string) {
      this.getExpenseSummary();
      if (this.expenseSummary) {
        const newData = this.expenseSummary.filter((t) => {
          return t.status == status;
        });
        console.log('QQQQQQQQQQQQQQQQ', newData);
        return newData.length;
      } else {
        return [];
      }
    },

    // getting the timesheets by status
    async getExpenseSummaryByStatus(status: string) {
      const callStr =
        status != ''
          ? `${Constants.endPointUrl}/expense-summary?status=${status}`
          : `${Constants.endPointUrl}/expense-summary`;

      try {
        const response = await axios.get(callStr);
        this.expenseSummary = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
