import { defineStore } from 'pinia';
import { ContactSummary } from '../../models/Contact/contactSummary';
import { Constants } from '../Constants';
import { linkHeader } from 'src/models/general/linkHeader';
import logger from 'src/helpers/logger';
import util from 'src/helpers/util';

export const useContactSummaryStore = defineStore('contactSummaryStore', {
  state: () => ({
    contactSummary: [] as ContactSummary[],
    url: '' as string,
    pageSize: 10,
    pageNum: 1,
    links: {} as linkHeader,
    errorMsg: '' as string,
  }),

  getters: {
    ContactSummary: (state) => state.contactSummary,
  },

  actions: {
    constructQueryParams() {
      const queryParams = new URLSearchParams();
      queryParams.append('pagesize', String(this.pageSize));
      queryParams.append('pagenumber', String(this.pageNum));
      return queryParams;
    },

    getUrl() {
      if (this.url) return;

      let callStr = '';
      if (this.links?.next) {
        callStr = `${util.endPointUrl()}/${this.links.next}`;
      } else {
        callStr = `${util.endPointUrl()}/contact-summary?`;
        const queryParams = this.constructQueryParams();
        const queryString = queryParams.toString();
        callStr += queryString ? `${queryString}` : '';
      }
      this.url = callStr;
    },

    async getUpdatedContacts(): Promise<boolean> {
      this.getUrl();
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(this.url);
        if (response.status === 200) {
          const summaries = response.data.data;
          this.contactSummary.push(...summaries);
          this.links = response.data.pagination.next || '{}';
          this.url = this.links ? `${this.links}` : '';
        } else if (response.status === 204) {
          this.errorMsg = response.statusText;
          return true;
        } else {
          return true;
        }
      } catch (error) {
        Constants.throwError(error);
      }
      return this.url === 'null';
    },

    async getContactSummary() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.endPointUrl()}/contact-summary`
        );
        this.contactSummary = response.data;
      } catch (error: any) {
        alert(error);
        logger.log(error);
      }
    },

    async getContactSummaryByBatch(limit: number, page: number) {
      const callStr = `${util.endPointUrl()}/contact-summary?_limit=${limit}&_page=${page}`;
      const response = await fetch(callStr);
      const data = await response.json();
      this.contactSummary.push(...data);
    },

    async getContactSummaryWithFilter(
      limit: number,
      page: number,
      filter: string
    ) {
      const callStr = `${util.endPointUrl()}/contact-summary?_limit=${limit}&_page=${page}&first_name_like=${filter}`;
      const response = await fetch(callStr);
      const data = await response.json();
      this.contactSummary.push(...data);
    },
  },
});
