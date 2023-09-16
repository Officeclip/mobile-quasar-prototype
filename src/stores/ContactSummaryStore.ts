import { defineStore } from 'pinia';
import { ContactSummary } from '../models/contactList';
import axios from 'axios';
import { Constants } from './Constants';

export const useContactSummaryStore = defineStore('contactSummaryStore', {
  state: () => ({
    contactSummary: [] as ContactSummary[],
  }),

  getters: {
    ContactSummary: (state) => state.contactSummary,
  },

  actions: {
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
