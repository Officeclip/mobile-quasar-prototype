import { defineStore } from 'pinia';
import { Contact } from '../models/contact';
import { State } from '../models/state';
import axios from 'axios';
import { Constants } from './Constants';

export const useContactsStore = defineStore('contactsStore', {
  state: () => ({
    contacts: [] as Contact[],
    states: [] as State[],
    contact: undefined as Contact | undefined, // we kept it separate because we will make a
  }),

  getters: {
    Contacts: (state) => state.contacts,
    States: (state) => state.states,
    Contact: (state) => state.contact,
  },

  actions: {
    async getContacts() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/contact-list`
        );
        this.contacts = response.data;
        //console.log(`ContactsStore: getContacts - ${this.contacts}`);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async getStates() {
      try {
        const response = await axios.get(`${Constants.endPointUrl}/states`);
        this.states = response.data;
        //console.log(`getStates: ${this.states}`)
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    //   ----getting single user details by id----
    async getContactSummary(id: number) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/contact-summary?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.contact = response.data[0];
        }
        console.log(
          `ContactsStore: getContacts - length - ${response.data.length}, ${this.contact}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async getContactsByBatch(limit: number, page: number) {
      // FIXME: put correct type
      const callStr = `${Constants.endPointUrl}/contact-list?_limit=${limit}&_page=${page}`;
      //console.log(`callStr: ${callStr}`)
      const res = await fetch(callStr);
      const data = await res.json();
      //console.log(data);
      this.contacts.push(...data);
    },

    async getContactsWithFilter(limit: number, page: number, filter: string) {
      // FIXME: put correct type
      const callStr = `${Constants.endPointUrl}/contact-list?_limit=${limit}&_page=${page}&first_name_like=${filter}`;
      console.log(`callStr: ${callStr}`);
      const res = await fetch(callStr);
      const data = await res.json();
      //console.log(data);
      this.contacts.push(...data);
    },

    async editContact(contact: Contact) {
      const res = await fetch(
        `${Constants.endPointUrl}/contact-summary/${contact.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contact),
        }
      );
      const data = await res.json();
    },

    async addContact(contact: Contact) {
      this.contacts.push(contact);

      const res = await fetch(`${Constants.endPointUrl}/contact-summary`, {
        //TODO: Change to axios api
        method: 'POST',
        body: JSON.stringify(contact),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(this.contacts);
      this.getContacts();
    },

    async deleteContact(id: any) {
      console.log('Deleted id:', id);
      alert('Want to delete this Contact');
      this.contacts = this.contacts.filter((t) => {
        return t.id === id;
      });

      const res = await fetch(
        `${Constants.endPointUrl}/contact-summary/` + id,
        {
          method: 'DELETE',
        }
      );
    },
  },
});
