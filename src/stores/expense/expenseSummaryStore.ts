import { defineStore } from 'pinia';
import { expenseSummary } from '../../models/expense/expenseSummary';
import axios from 'axios';

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
          'http://localhost:4000/expense-summary'
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
          ? `http://localhost:4000/expense-summary?status=${status}`
          : 'http://localhost:4000/expense-summary';

      try {
        const response = await axios.get(callStr);
        this.expenseSummary = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
