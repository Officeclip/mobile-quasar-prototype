import { defineStore } from 'pinia';
// import { binder } from '../../models/issueTracker/trackerBinderSummary';
import { trackerCaseSummary } from '../../models/issueTracker/trackerCaseSumary';
// import axios from 'axios';
import { linkHeader } from 'src/models/general/linkHeader';
import { searchFilter } from 'src/models/issueTracker/searchFilter';
import util from 'src/helpers/util';
import { Constants } from 'stores/Constants';

export const useIssueSummaryStore = defineStore('issueSummaryStore', {
  state: () => ({
    // bindersList: {} as binder[],
    issuesList: [] as trackerCaseSummary[],
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
    constructBaseURL(binderId: string) {
      const baseUrl = `${util.endPointUrl()}/tracker-case-summary?binderSid=${binderId}&pagenumber=${
        this.pageNum
      }&pagesize=${this.pageSize}`;
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

    getUrl(binderId: string) {
      let callStr = '';
      if (!this.IsEmptyLinkHeader) {
        callStr = `${this.links}`;
      } else {
        callStr = this.constructBaseURL(binderId);
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

    async getIssuesUpdated(
      isFilter: boolean,
      binderId: string
    ): Promise<boolean> {
      this.getUrl(binderId);
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(this.url);
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

    // async getIssuesList(binderId: string): Promise<boolean> {
    //   //this.getUrl(binderId);
    //   try {
    //     const instance = Constants.getAxiosInstance();
    //     const response = await instance.get(
    //       `${util.endPointUrl()}/tracker-case-summary?binderSid=${binderId}`
    //     );
    //     if (response.status === 200) {
    //       const issues = response.data.data;
    //       this.issuesList.push(...issues);
    //       this.links = response.data.pagination.next || '{}';
    //       this.url = this.links ? `${this.links}` : '';
    //     } else {
    //       return true;
    //     }
    //     this.issuesList = response.data;

    //     // const issues = response.data;
    //     // this.issuesList.push(...issues);

    //     // this.links = JSON.parse(response.headers.links || '{}');
    //     // this.url = this.links.next
    //     //   ? `${'http://localhost:3000'}${this.links.next}`
    //     //   : '';
    //   } catch (error) {
    //     console.error(error);
    //   }

    //   return this.url === '';
    // },

    async getIssuesByParent(
      parentObjectId: number,
      parentObjectServiceType: number
    ) {
      const callStr =
        parentObjectId > 0 && parentObjectServiceType > 0
          ? `${util.endPointUrl()}/tracker-case-summary?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`
          : `${util.endPointUrl()}/tracker-case-summary`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.issuesList = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async resetIssuesSummaryList() {
      this.issuesList = [];
    },
  },
});
