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
    // async getIssueDetails() {
    //   const baseURL = 'http://localhost:3000/issue-details';
    //   const response = await axios.get(baseURL);
    //   this.issueDetails = response.data[0];
    // },

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
        logger.throwError(error);
      }
    },

    async addNewIssue(issueFormCtrlValues: trackerCaseDetails) {
      try {
        const baseURL = 'http://localhost:3000/issue-details';
        const response = await axios.post(baseURL, issueFormCtrlValues);
        if (response.status === 200) {
          this.issueDetails = response.data;
        }
      } catch (error) {
        console.log('Axios error', error);
      }
    },

    // async deleteIssueDetails(id: string) {
    //   const baseURL = 'http://localhost:3000/issue-details';
    //   const response = await axios.delete(`${baseURL}/${id}`);
    //   if (response.status === 200) {
    //     this.issueDetails = response.data;
    //   }
    // },
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

    // async editIssue(issueFormCtrlValues: trackerCaseDetails) {
    //   try {
    //     const baseURL = 'http://localhost:3000/issue-details';
    //     const response = await axios.put(baseURL, issueFormCtrlValues);
    //     if (response.status === 200) {
    //       this.issueDetails = response.data;
    //     }
    //   } catch (error) {
    //     console.log('Axios error', error);
    //   }
    // },
    async editTrackerCaseDetails(trackerCaseDetails: trackerCaseDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${util.endPointUrl()}/tracker-case-detail/${trackerCaseDetails.id}`,
          trackerCaseDetails
        );
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
