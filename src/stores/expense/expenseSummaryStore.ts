import { defineStore } from 'pinia';
import { expenseSummary } from '../../models/expense/expenseSummary';
import axios from 'axios';
import { Constants } from 'stores/Constants';

export const useExpenseSummaryStore = defineStore('expenseSummaryStore', {
  state: () => ({
    expenseSummary: [] as expenseSummary[],
    expenseSummaryById: [] as expenseSummary[],
  }),

  getters: {
    ExpenseSummary: (state) => state.expenseSummary,
    ExpenseSummaryById: (state) => state.expenseSummaryById,
  },

  actions: {
    // getting all the timesheets for testing only, probably no where this use
    async getExpenseSummary() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/expense-summary`
        );
        this.expenseSummary = response.data;
        console.log(`getExpenseSummary(): ${this.expenseSummary}`);
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
        console.log(`getExpenseSummaryCount(): ${newData}`);
        return newData.length;
      } else {
        return [];
      }
    },

    async getExpenseSummaryById(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/expense-summary?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.expenseSummaryById = response.data[0];
          console.log('getExpenseSummaryById(): ', this.expenseSummaryById);
        }
      } catch (error) {
        alert(error);
      }
    },

    // getting the timesheets by status
    async getExpenseSummaryByStatus(status: string) {
      const callStr =
        status != ''
          ? `${Constants.endPointUrl}/expense-summary?status=${status}`
          : `${Constants.endPointUrl}/expense-summary`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.expenseSummary = response.data;
        console.log('getExpenseSummaryByStatus(): ', this.expenseSummaryById);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
