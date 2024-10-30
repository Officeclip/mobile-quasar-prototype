import { defineStore } from 'pinia';
import axios from 'axios';
import { trackerCaseDetails } from 'src/models/issueTracker/trackerCaseDetails';

export const useIssueDetailsStore = defineStore('issueDetailsStore', {
  state: () => ({
    issueDetails: {} as trackerCaseDetails,
  }),

  getters: {
    IssueDetails: (state) => state.issueDetails,
  },

  actions: {
    async getIssueDetails() {
      const baseURL = 'http://localhost:3000/issue-details';
      const response = await axios.get(baseURL);
      this.issueDetails = response.data[0];
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

    async deleteIssueDetails(id: string) {
      const baseURL = 'http://localhost:3000/issue-details';
      const response = await axios.delete(`${baseURL}/${id}`);
      if (response.status === 200) {
        this.issueDetails = response.data;
      }
    },

    async editIssue(issueFormCtrlValues: trackerCaseDetails) {
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
