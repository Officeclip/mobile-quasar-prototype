import { defineStore } from 'pinia';
import { ContactDetails } from '../models/Contact/contactDetails';
import { State, Country } from '../models/Contact/contactList';
import axios from 'axios';
import { Constants } from './Constants';
import { useContactListStore } from './ContactListStore';

export const useContactDetailsStore = defineStore('contactDetailsStore', {
  state: () => ({
    contactDetailsList: [] as ContactDetails[],
    states: [] as State[],
    countries: [] as Country[],
    contactDetails: undefined as ContactDetails | undefined, // we kept it separate because we will make a
  }),

  getters: {
    ContactDetailsList: (state) => state.contactDetailsList,
    States: (state) => state.states,
    Countries: (state) => state.countries,
    ContactDetails: (state) => state.contactDetails,
  },

  actions: {
    async getContacts() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/contact-summary`
        );
        this.contactDetailsList = response.data;
        //console.log(`ContactsStore: getContacts - ${this.contacts}`);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async getContactLists() {
      try {
        const contactListStore = useContactListStore();
        await contactListStore.getContactList('states');
        this.states = contactListStore.State;
        this.countries = contactListStore.Countries;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    //   ----getting single user details by id----
    async getContactDetails(id: number) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/contact-details?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.contactDetails = response.data[0];
        }
        console.log(
          `ContactDetailsStore: getContactDetails - length - ${response.data.length}, ${this.contactDetails}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async getContactsByBatch(limit: number, page: number) {
      // FIXME: put correct type
      const callStr = `${Constants.endPointUrl}/contact-summary?_limit=${limit}&_page=${page}`;
      //console.log(`callStr: ${callStr}`)
      const res = await fetch(callStr);
      const data = await res.json();
      //console.log(data);
      this.contactDetailsList.push(...data);
    },

    async getContactsWithFilter(limit: number, page: number, filter: string) {
      // FIXME: put correct type
      const callStr = `${Constants.endPointUrl}/contact-summary?_limit=${limit}&_page=${page}&first_name_like=${filter}`;
      console.log(`callStr: ${callStr}`);
      const res = await fetch(callStr);
      const data = await res.json();
      //console.log(data);
      this.contactDetailsList.push(...data);
    },

    async editContactDetails(contactDetails: ContactDetails) {
      const res = await fetch(
        `${Constants.endPointUrl}/contact-details/${contactDetails.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactDetails),
        }
      );
      const data = await res.json();
    },

    async addContactDetails(contactDetails: ContactDetails) {
      this.contactDetailsList.push(contactDetails);

      const res = await fetch(`${Constants.endPointUrl}/contact-details`, {
        //TODO: Change to axios api
        method: 'POST',
        body: JSON.stringify(contactDetails),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(this.contactDetailsList);
      this.getContacts();
    },

    async deleteContactDetails(id: any) {
      console.log('Deleted id:', id);
      alert('Want to delete this Contact');
      this.contactDetailsList = this.contactDetailsList.filter((t) => {
        return t.id === id;
      });

      const res = await fetch(
        `${Constants.endPointUrl}/contact-details/` + id,
        {
          method: 'DELETE',
        }
      );
    },
  },
});
