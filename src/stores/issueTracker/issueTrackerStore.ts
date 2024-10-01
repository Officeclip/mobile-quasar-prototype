import { defineStore } from 'pinia';
import { binder } from '../../models/issueTracker/bindersList';
import { issueSummary } from '../../models/issueTracker/issuesList';
import axios from 'axios';
import { issueDetails } from 'src/models/issueTracker/issueDetails';

export const useIssueTrackerStore = defineStore('issueTrackerStore', {
  state: () => ({
    bindersList: {} as binder[],
    issuesList: {} as issueSummary[],
    issueDetails: {} as issueDetails,
  }),

  getters: {
    BindersList: (state) => state.bindersList,
    IssuesList: (state) => state.issuesList,
    IssueDetails: (state) => state.issueDetails,
  },

  actions: {
    async getBindersList() {
      const baseURL = 'http://localhost:3000/binders';

      const response = await axios.get(baseURL);
      this.bindersList = response.data;
    },

    async getIssuesList() {
      const baseURL = 'http://localhost:3000/issues';

      const response = await axios.get(baseURL);
      this.issuesList = response.data;
    },

    async getIssueDetails() {
      const baseURL = 'http://localhost:3000/issue-details';
      const response = await axios.get(baseURL);
      this.issueDetails = response.data[0];
    },

    async addNewIssue(issueFormCtrlValues: issueDetails) {
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

    async editIssue(issueFormCtrlValues: issueDetails) {
      try {
        const baseURL = 'http://localhost:3000/issue-details';
        const response = await axios.put(baseURL, issueFormCtrlValues);
        if (response.status === 200) {
          this.issueDetails = response.data;
        }
      } catch (error) {
        console.log('Axios error', error);
      }
    },
  },
});
