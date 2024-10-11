import { defineStore } from 'pinia';
import { binder } from '../../models/issueTracker/bindersList';
import { issueSummary } from '../../models/issueTracker/issuesList';
import axios from 'axios';
import { linkHeader } from 'src/models/general/linkHeader';

export const useIssueSummaryStore = defineStore('issueSummaryStore', {
  state: () => ({
    bindersList: {} as binder[],
    issuesList: {} as issueSummary[],
    url: '' as string,
    pageSize: 10,
    pageNum: 1,
    links: {} as linkHeader,
  }),

  getters: {
    BindersList: (state) => state.bindersList,
    IssuesList: (state) => state.issuesList,
  },

  actions: {
    constructQueryParams() {
      const queryParams = new URLSearchParams();
      queryParams.append('pagesize', String(this.pageSize));
      queryParams.append('pagenumber', String(this.pageNum));
      return queryParams;
    },

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
