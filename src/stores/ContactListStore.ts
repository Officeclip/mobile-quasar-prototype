import { defineStore } from 'pinia';
import { State, Country } from '../models/Contact/contactsList';
import axios from 'axios';
import { Constants } from './Constants';

export const useContactListStore = defineStore('contactListStore', {
  state: () => ({
    // timesheetList: undefined as TimesheetList | undefined,
    states: [] as State[],
    countries: [] as Country[],
  }),

  getters: {
    States: (state) => state.states,
    Countries: (state) => state.countries,
  },

  actions: {
    // getting all the timesheets for testing only, probably no where this use
    // TODO: Get all the list item at one time.
    async getContactList() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/contact-lists`
        );
        const contactList = response.data[0];
        //this.timesheetList = timesheetList;
        //debugger;
        this.states = contactList.states;
        this.countries = contactList.countries;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
