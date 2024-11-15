import { defineStore } from 'pinia';
import axios from 'axios';
import { trackerCaseDetails } from 'src/models/issueTracker/trackerCaseDetails';
import logger from 'src/helpers/logger';
import { Constants } from '../Constants';
import util from 'src/helpers/util';

export const useIssueDetailsStore = defineStore('issueDetailsStore', {
  state: () => ({
    issueDetails: {} as trackerCaseDetails,
  }),

  getters: {
    IssueDetails: (state) => state.issueDetails,
  },

  actions: {
    async getTrackerCaseDetails(id: string | string[]) {
      logger.log(`*** taskDetailStore:getTask(${id}) ***`);
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.endPointUrl()}/tracker-case-detail/${id}`
        );
        this.issueDetails = response.data;
      } catch (error) {
        logger.log(`*** taskDetailStore:catch(${error}) ***`, 'error');
        Constants.throwError(error);
      }
    },

    async addNewTrackerCaseDetails(trackerCaseDetails: trackerCaseDetails) {
      const callStr = `${util.endPointUrl()}/tracker-case-detail`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(callStr, trackerCaseDetails);
        if (response.status === 200) {
          this.issueDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
    async deleteTrackerCaseDetails(id: string) {
      const callStr = `${util.endPointUrl()}/tracker-case-detail/${id}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(callStr);
        if (response.status === 200) {
          this.issueDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
    async editTrackerCaseDetails(trackerCaseDetails: trackerCaseDetails) {
      try {
        const callStr = `${util.endPointUrl()}/tracker-case-detail/${
          trackerCaseDetails.id
        }`;
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(callStr, trackerCaseDetails);
        if (response.status === 200) {
          this.issueDetails = response.data;
        }
      } catch (error) {
        logger.log(`*** taskDetailStore:editTask(...):catch: ${error} ***`);
        Constants.throwError(error);
      }
    },
  },
});
