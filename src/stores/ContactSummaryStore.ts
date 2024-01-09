import { defineStore } from 'pinia';
import { ContactSummary } from '../models/Contact/contactSummary';
import axios from 'axios';
import { Constants } from './Constants';
import { linkHeader } from 'src/models/general/linkHeader';

export const useContactSummaryStore = defineStore('contactSummaryStore', {
  state: () => ({
    contactSummary: [] as ContactSummary[],
    url: '' as string,
    pageSize: 30,
    pageNum: 1,
    //filter: {} as searchFilter,
    //parentObjectId: 0,
    //parentObjectServiceType: 0,
    links: {} as linkHeader,
  }),

  getters: {
    ContactSummary: (state) => state.contactSummary,
  },

  actions: {
    constructQueryParams() {
      const queryParams = new URLSearchParams();
      queryParams.append('pageSize', String(this.pageSize));
      queryParams.append('pageNum', String(this.pageNum));
      return queryParams;
    },

    getUrl() {
      if (this.url) return;

      let callStr = '';
      if (this.links?.next) {
        callStr = `${Constants.endPointUrl}/${this.links.next}`;
      } else {
        callStr = `${Constants.endPointUrl}/contact-summary?`;
        const queryParams = this.constructQueryParams();
        const queryString = queryParams.toString();
        callStr += queryString ? `&${queryString}` : '';
      }

      this.url = callStr;
    },

    async getUpdatedContacts(): Promise<boolean> {
      this.getUrl();

      try {
        // console.log("URL called", this.url);
        const res = await axios.get(this.url);
        const summaries = res.data;
        this.contactSummary.push(...summaries);

        this.links = JSON.parse(res.headers.get('Links') || '{}');
        this.url = this.links.next
          ? `${Constants.endPointUrl}${this.links.next}`
          : '';
        // console.log("next url from header", this.url);
      } catch (error) {
        console.error(error);
      }
      return this.url === '';
    },

    async getContactSummary() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/contact-summary`
        );
        this.contactSummary = response.data;
        //console.log(`ContactsStore: getContacts - ${this.contacts}`);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async getContactSummaryByBatch(limit: number, page: number) {
      // FIXME: put correct type
      const callStr = `${Constants.endPointUrl}/contact-summary?_limit=${limit}&_page=${page}`;
      //console.log(`callStr: ${callStr}`)
      const res = await fetch(callStr);
      const data = await res.json();
      //console.log(data);
      this.contactSummary.push(...data);
    },

    async getContactSummaryWithFilter(
      limit: number,
      page: number,
      filter: string
    ) {
      // FIXME: put correct type
      const callStr = `${Constants.endPointUrl}/contact-summary?_limit=${limit}&_page=${page}&first_name_like=${filter}`;
      console.log(`callStr: ${callStr}`);
      const res = await fetch(callStr);
      const data = await res.json();
      //console.log(data);
      this.contactSummary.push(...data);
    },
  },
});
