import { defineStore } from 'pinia';
import { ContactSummary } from '../../models/Contact/contactSummary';
import { Constants } from '../Constants';
import { linkHeader } from 'src/models/general/linkHeader';
import util from 'src/helpers/util';
import { searchFilter } from 'src/models/Contact/searchFilter';

export const useContactSummaryStore = defineStore('contactSummaryStore', {
  state: () => ({
    contactSummary: [] as ContactSummary[],
    url: '' as string,
    pageSize: 10,
    pageNum: 1,
    links: {} as linkHeader,
    errorMsg: '' as string,
    filter: {} as searchFilter,
  }),

  getters: {
    ContactSummary: (state) => state.contactSummary,
    IsEmptyLinkHeader: (state) => Object.keys(state.links).length == 0,
  },

  actions: {
    constructBaseURL() {
      const baseUrl = `${util.getEndPointUrl()}/contact-summary?pagenumber=${
        this.pageNum
      }&pagesize=${this.pageSize}`;
      return baseUrl;
    },

    constructQueryParams() {
      const queryParams = new URLSearchParams();
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

    async getUpdatedContacts(isFilter: boolean): Promise<boolean> {
      this.getUrl();
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(this.url);
        if (response.status === 200) {
          const summaries = response.data.data;
          if (isFilter) {
            await this.resetContactSummaryList();
          }
          this.contactSummary.push(...summaries);
          this.links = response.data.pagination.next || '{}';
          this.url = this.links ? `${this.links}` : '';
        } else if (response.status === 204) {
          await this.resetContactSummaryList();
          this.errorMsg = response.statusText;
          return true;
        } else {
          return true;
        }
      } catch (error) {}
      return this.url === 'null';
    },

    async getContactSummary() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/contact-summary`
        );
        this.contactSummary = response.data;
      } catch (error: any) {
        alert(error);
      }
    },

    async getContactSummaryByBatch(limit: number, page: number) {
      const callStr = `${util.getEndPointUrl()}/contact-summary?_limit=${limit}&_page=${page}`;
      const response = await fetch(callStr);
      const data = await response.json();
      this.contactSummary.push(...data);
    },

    async getContactSummaryWithFilter(
      limit: number,
      page: number,
      filter: string
    ) {
      const callStr = `${util.getEndPointUrl()}/contact-summary?_limit=${limit}&_page=${page}&first_name_like=${filter}`;
      const response = await fetch(callStr);
      const data = await response.json();
      this.contactSummary.push(...data);
    },

    async resetContactSummaryList() {
      this.contactSummary = [];
    },
  },
});
