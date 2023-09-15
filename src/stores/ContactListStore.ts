import { defineStore } from 'pinia';
import { ContactList } from '../models/contactList';
import axios from 'axios';
import { Constants } from './Constants';

export const useContactListStore = defineStore('contactsStore', {
  state: () => ({
    contactList: [] as ContactList[],
  }),

  getters: {
    ContactList: (state) => state.contactList,
  },

  actions: {
    async getContactList() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/contact-list`
        );
        this.contactList = response.data;
        //console.log(`ContactsStore: getContacts - ${this.contacts}`);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async getContactListByBatch(limit: number, page: number) {
      // FIXME: put correct type
      const callStr = `${Constants.endPointUrl}/contact-list?_limit=${limit}&_page=${page}`;
      //console.log(`callStr: ${callStr}`)
      const res = await fetch(callStr);
      const data = await res.json();
      //console.log(data);
      this.contactList.push(...data);
    },

    async getContactListWithFilter(
      limit: number,
      page: number,
      filter: string
    ) {
      // FIXME: put correct type
      const callStr = `${Constants.endPointUrl}/contact-list?_limit=${limit}&_page=${page}&first_name_like=${filter}`;
      console.log(`callStr: ${callStr}`);
      const res = await fetch(callStr);
      const data = await res.json();
      //console.log(data);
      this.contactList.push(...data);
    },
  },
});
