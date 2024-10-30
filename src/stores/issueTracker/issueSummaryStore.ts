import { defineStore } from 'pinia';
// import { binder } from '../../models/issueTracker/trackerBinderSummary';
import { issueSummary } from '../../models/issueTracker/issueSummary';
import axios from 'axios';
import { linkHeader } from 'src/models/general/linkHeader';
import { searchFilter } from 'src/models/issueTracker/searchFilter';

export const useIssueSummaryStore = defineStore('issueSummaryStore', {
  state: () => ({
    // bindersList: {} as binder[],
    issuesList: [] as issueSummary[],
    url: '' as string,
    pageSize: 10,
    pageNum: 1,
    filter: {} as searchFilter,
    links: {} as linkHeader,
  }),

  getters: {
    // BindersList: (state) => state.bindersList,
    IssuesList: (state) => state.issuesList,
    IsEmptyLinkHeader: (state) => Object.keys(state.links).length == 0,
  },

  actions: {
    constructBaseURL() {
      const baseUrl = `$'http://localhost:3000/binders'?pagenumber=${this.pageNum}&pagesize=${this.pageSize}`;
      return baseUrl;
    },

    constructQueryParams() {
      const queryParams = new URLSearchParams();
      // queryParams.append('pagesize', String(this.pageSize));
      // queryParams.append('pagenumber', String(this.pageNum));
      const params: searchFilter = this.filter;
      const filterKeys = Object.keys(params);
      filterKeys.forEach((key) => {
        if (this.filter[key]) {
          queryParams.append(key, String(this.filter[key]));
        }
      });
      return queryParams;
    },

    getUrl() {
      let callStr = '';
      if (!this.IsEmptyLinkHeader) {
        callStr = `${this.links}`;
      } else {
        callStr = this.constructBaseURL();
        const queryParams = this.constructQueryParams();
        const queryString = queryParams.toString();
        callStr += queryString ? `&${queryString}` : '';
      }
      this.url = callStr;
    },

    setFilter(searchFilter: searchFilter) {
      this.filter = searchFilter;
    },

    resetPageNumber() {
      this.pageNum = 1;
      this.links = {} as linkHeader; // https://stackoverflow.com/a/45339463
    },

    async getIssuesUpdated(isFilter: boolean): Promise<boolean> {
      this.getUrl();
      try {
        // const instance = Constants.getAxiosInstance();
        const response = await axios.get(this.url);
        if (response.status === 200) {
          const summaries = response.data.data;
          if (isFilter) {
            await this.resetIssuesSummaryList();
          }
          this.issuesList.push(...summaries);
          this.links = response.data.pagination.next || '{}';
          this.url = this.links ? `${this.links}` : '';
        } else {
          return true;
        }
      } catch (error) {}
      return this.url === 'null';
    },

    // async getBindersList() {
    //   const baseURL = 'http://localhost:3000/binders';

    //   const response = await axios.get(baseURL);
    //   this.bindersList = response.data;
    // },

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

    async resetIssuesSummaryList() {
      this.issuesList = [];
    },
  },
});
