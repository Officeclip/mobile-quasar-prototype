import { defineStore } from 'pinia';
import { binder } from '../../models/issueTracker/bindersList';
import { issueSummary } from '../../models/issueTracker/issuesList';
import axios from 'axios';

export const useIssueTrackerStore = defineStore('issueTrackerStore', {
  state: () => ({
    bindersList: {} as binder[],
    issuesList: {} as issueSummary[],
  }),

  getters: {
    BindersList: (state) => state.bindersList,
    IssuesList: (state) => state.issuesList,
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
  },
});
