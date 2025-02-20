import { defineStore } from 'pinia';
import { TimeOffSummary } from '../../models/TimeOff/timeOffSummary';
import { TimeOffDetails } from 'src/models/TimeOff/timeOffDetails';
import { Categories } from 'src/models/TimeOff/timeOffList';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util';

export const useTimeOffStore = defineStore('timeOffStore', {
  state: () => ({
    timeOff: [] as TimeOffSummary[],
    timeOffDetail: {} as TimeOffDetails,
    categoryLists: [] as Categories[],
    errorMsg: '' as string,
  }),

  getters: {
    TimeOffSummaries: (state) => state.timeOff,
    TimeOffDetail: (state) => state.timeOffDetail,
    CategoryLists: (state) => state.categoryLists,
  },

  actions: {
    // getting the time off summary by category
    async getTimeOffByCategory(category: string) {
      // const callStr = `${util.getEndPointUrl()}/timeoff-summary?category=${category}`;
      const callStr = `http://localhost:3000/timeoff-summary?category=${category}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr ?? '');
        this.timeOff = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    // getting the time off details by id
    async getTimeOffDetails(id: string) {
      const callStr = `http://localhost:3000/timeoff-detail/${id}`;
      try {
        const instance = Constants.getAxiosInstance();
        // const response = await instance.get(
        //   `${util.getEndPointUrl()}/timeoff-detail/${id}`
        // );
        const response = await instance.get(callStr ?? '');
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
          this.timeOff = response.data;
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

    async getTimeOffLists() {
      const callStr = 'http://localhost:3000/timeoff-list';
      try {
        const instance = Constants.getAxiosInstance();
        // const response = await instance.get(
        //   `${util.getEndPointUrl()}/timeoff-list`
        // );
        const response = await instance.get(callStr ?? '');
        this.categoryLists = response.data[0].category;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
