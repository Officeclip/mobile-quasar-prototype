import { defineStore } from 'pinia';
import { binder } from '../../models/issueTracker/bindersList';
import { issueSummary } from '../../models/issueTracker/issuesList';
import axios from 'axios';
import { linkHeader } from 'src/models/general/linkHeader';

export const useIssueSummaryStore = defineStore('issueSummaryStore', {
  state: () => ({
    bindersList: {} as binder[],
    issuesList: [] as issueSummary[],
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

    async getIssuesList(): Promise<boolean> {
      const baseURL = 'http://localhost:3000/issues';
      try {
        const response = await axios.get(baseURL);
        // if (response.status === 200) {
        //   const issues = response.data;
        //   this.issuesList.push(...issues);
        //   const obj = JSON.parse(response.headers.links);
        //   console.log('obj:', obj.next);
        //   this.links = obj.next || '{}';
        //   this.url = this.links ? `${this.links}` : '';
        // } else {
        //   return true;
        // }
        //this.issuesList = response.data;

        const issues = response.data;
        this.issuesList.push(...issues);

        this.links = JSON.parse(response.headers.links || '{}');
        this.url = this.links.next
          ? `${'http://localhost:3000'}${this.links.next}`
          : '';
      } catch (error) {
        console.error(error);
      }

      return this.url === '';
    },
  },
});
