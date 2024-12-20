import { defineStore } from 'pinia';
import { expenseSummary } from '../../models/expense/expenseSummary';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util';

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
    async getExpenseSummary() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/expense-summary`
        );
        this.expenseSummary = response.data;
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
        return newData.length;
      } else {
        return [];
      }
    },

    async getExpenseSummaryById(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/expense-summary?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.expenseSummaryById = response.data[0];
        }
      } catch (error) {
        alert(error);
      }
    },

    async getExpenseSummaryByStatus(status: string) {
      const callStr =
        status != ''
          ? `${util.getEndPointUrl()}/expense-summary?status=${status}`
          : `${util.getEndPointUrl()}/expense-summary`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.expenseSummary = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
