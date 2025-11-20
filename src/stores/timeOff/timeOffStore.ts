import { defineStore } from 'pinia';
import { TimeOffSummary } from '../../models/TimeOff/timeOffSummary';
import { TimeOffDetails } from 'src/models/TimeOff/timeOffDetails';
import { Categories } from 'src/models/TimeOff/timeOffList';
import { Constants } from '../../stores/Constants';
import util from 'src/helpers/util';

export const useTimeOffStore = defineStore('timeOffStore', {
  state: () => ({
    timeOffSummary: [] as TimeOffSummary[],
    timeOffDetail: {} as TimeOffDetails,
    categoryLists: [] as Categories[],
    selectedTab: 'inbox' as string,
    pageSize: 15,
    nextPageUrl: null as string | null, // Stores the 'next' URL from the API
    errorMsg: '' as string,
  }),

  getters: {
    TimeOffSummaries: (state) => state.timeOffSummary,
    TimeOffDetail: (state) => state.timeOffDetail,
    CategoryLists: (state) => state.categoryLists,
  },

  actions: {
    /**
     * Resets the timesheet list and pagination.
     * Call this before loading data for a new category.
     */
    async resetTimeOffSummaryList() {
      this.timeOffSummary = [];
      this.nextPageUrl = null;
      this.errorMsg = '';
    },

    // getting the time off summary by category
    async fetchMoreTimeOffSummaries(category: string): Promise<boolean> {
      // Use the next page URL from the previous API call, or construct the initial URL.
      const isFirstPageLoad = this.timeOffSummary.length === 0;
      const requestUrl =
        isFirstPageLoad || !this.nextPageUrl
          ? `${util.getEndPointUrl()}/timeoff-summary?category=${category}&pagesize=${this.pageSize}`
          : this.nextPageUrl;

      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(requestUrl);

        if (response.status === 200) {
          const summaries = response.data.data;
          this.timeOffSummary.push(...summaries);
          const nextLink = response.data.pagination.next;
          // Store the next page URL from the API's pagination object. If it's null, we've reached the end.
          this.nextPageUrl = nextLink && nextLink !== 'null' ? nextLink : null;

          return this.nextPageUrl === null; // Return true if end is reached
        }
        if (response.status === 204) {
          if (this.timeOffSummary.length === 0) {
            this.errorMsg =
              category === 'mylist'
                ? 'No TimeOffs are created yet.'
                : category === 'inbox'
                  ? 'No TimeOffs sent yet.'
                  : 'No Archived TimeOffs found.';
          }
          return true; // No content, so we've reached the end.
        }
        return true; // For any other status, stop loading.
      } catch (error) {
        Constants.throwError(error);
        return true; // Stop loading on error.
      }
    },

    // getting the time off details by id
    async getTimeOffDetails(id: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/timeoff-detail/${id}`,
        );
        this.timeOffDetail = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    //editing the time off details
    async editTimeOff(timeOffDetail: TimeOffDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${util.getEndPointUrl()}/timeoff-detail/${timeOffDetail.id}`,
          timeOffDetail,
        );
        if (response.status === 200) {
          this.timeOffDetail = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    //deleting the time off details
    async deleteTimeOff(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${util.getEndPointUrl()}/timeoff-detail/${id}`,
        );
        if (response.status === 200) {
          this.timeOffSummary = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    //adding the time off details
    async addTimeOffDetails(timeOffDetail: TimeOffDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${util.getEndPointUrl()}/timeoff-detail`,
          timeOffDetail,
        );
        if (response.status === 200) {
          this.timeOffDetail = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getTimeOffLists(userId: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/timeoff-lists?userId=${userId}`,
        );
        const newData = response.data[0];
        this.categoryLists = newData.category;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
