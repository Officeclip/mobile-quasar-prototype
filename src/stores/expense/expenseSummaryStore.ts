import { defineStore } from 'pinia';
import { expenseSummary } from '../../models/expense/expenseSummary';
import { Constants } from '../../stores/Constants';
import util from 'src/helpers/util';

export const useExpenseSummaryStore = defineStore('expenseSummaryStore', {
  state: () => ({
    expenseSummary: [] as expenseSummary[],
    selectedTab: 'inbox' as string,
    pageSize: 15,
    nextPageUrl: null as string | null,
    errorMsg: '' as string,
  }),

  getters: {
    ExpenseSummary: (state) => state.expenseSummary,
  },

  actions: {
    /**
     * Resets the timesheet list and pagination.
     * Call this before loading data for a new category.
     */
    async resetExpenses() {
      this.expenseSummary = [];
      this.nextPageUrl = null;
      this.errorMsg = '';
    },

    async fetchMoreExpenseSummaries(category: string): Promise<boolean> {
      // Use the next page URL from the previous API call, or construct the initial URL.
      const isFirstPageLoad = this.expenseSummary.length === 0;
      const requestUrl =
        isFirstPageLoad || !this.nextPageUrl
          ? `${util.getEndPointUrl()}/expense-summary?category=${category}&pagesize=${this.pageSize}`
          : this.nextPageUrl;

      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(requestUrl);

        if (response.status === 200) {
          const summaries = response.data.data;
          this.expenseSummary.push(...summaries);
          const nextLink = response.data.pagination.next;
          // Store the next page URL from the API's pagination object. If it's null, we've reached the end.
          this.nextPageUrl = nextLink && nextLink !== 'null' ? nextLink : null;
          return this.nextPageUrl === null; // Return true if end is reached
        }

        if (response.status === 204) {
          if (this.expenseSummary.length === 0) {
            this.errorMsg = 'No Content';
          }
          return true; // No content, so we've reached the end.
        }

        return true; // For any other status, stop loading.
      } catch (error) {
        Constants.throwError(error);
        return true; // Stop loading on error.
      }
    },

    async getExpenseDetails(expenseSid: string | string[], stageId: number) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/expense-detail?expenseSid=${expenseSid}&stageId=${stageId}`,
        );
        this.expenseDetailsList = response.data;
      } catch (error) {
        Constants.throwError(error);
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

    // async getExpenseSummaryByStatus(status: string) {
    //   const callStr =
    //     status != ''
    //       ? `${util.getEndPointUrl()}/expense-summary?status=${status}`
    //       : `${util.getEndPointUrl()}/expense-summary`;
    //   try {
    //     const instance = Constants.getAxiosInstance();
    //     const response = await instance.get(callStr);
    //     this.expenseSummary = response.data;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
  },
});
