import { defineStore } from 'pinia';
import { TimeOffSummary } from '../../models/TimeOff/timeOffSummary';
import { TimeOffDetails } from 'src/models/TimeOff/timeOffDetails';
import { Categories } from 'src/models/TimeOff/timeOffList';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util';

export const useTimeOffStore = defineStore('timeOffStore', {
  state: () => ({
    timeOffSummary: [] as TimeOffSummary[],
    timeOffDetail: {} as TimeOffDetails,
    categoryLists: [] as Categories[],
    errorMsg: '' as string,
    selectedTab: 'inbox' as string,
  }),

  getters: {
    TimeOffSummaries: (state) => state.timeOffSummary,
    TimeOffDetail: (state) => state.timeOffDetail,
    CategoryLists: (state) => state.categoryLists,
  },

  actions: {
    // getting the time off summary by category
    async getTimeOffByCategory(category: string) {
      const callStr = `${util.getEndPointUrl()}/timeoff-summary?category=${category}`;
      // const callStr = `http://localhost:3000/timeoff-summary?category=${category}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr ?? '');
        this.timeOffSummary = response.data.data;
        if (response.status === 204) {
          //this.errorMsg = response.statusText;
          this.errorMsg = 'No Content';
          return true;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    // getting the time off details by id
    async getTimeOffDetails(id: string) {
      // const callStr = `${util.getEndPointUrl()}/timeoff-detail/${id}`;
      // const callStr = `http://localhost:3000/timeoff-detail/${id}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/timeoff-detail/${id}`
        );
        // const response = await instance.get(callStr ?? '');
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
          timeOffDetail
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
          `${util.getEndPointUrl()}/timeoff-detail/${id}`
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
          timeOffDetail
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
          `${util.getEndPointUrl()}/timeoff-lists?userId=${userId}`
        );
        // const response = await instance.get(callStr ?? '');
        const newData = response.data[0];
        this.categoryLists = newData.category;
      } catch (error) {
        Constants.throwError(error);
      }
    },
    async resetTimeOffSummaryList() {
      this.timeOffSummary = [];
    },
  },
});
