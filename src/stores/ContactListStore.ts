import { defineStore } from 'pinia';
import { State, Country } from '../models/Contact/contactList';
import axios from 'axios';
import { Constants } from './Constants';

export const useContactListStore = defineStore('contactListStore', {
  state: () => ({
    // timesheetList: undefined as TimesheetList | undefined,
    state: [] as State[],
    countries: [] as Country[],
  }),

  getters: {
    State: (state) => state.state,
    Countries: (state) => state.countries,
  },

  actions: {
    // getting all the timesheets for testing only, probably no where this use
    // TODO: Get all the list item at one time.
    async getContactList(name: string) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}contact-List?name=${name}`
        );
        console.log('Response', response);
        const data = response.data[0].items;
        const newData = Object.keys(data).map((key) => data[key]);

        console.log('New Data', newData);

        if (name === 'State') {
          this.state = newData;
        } else if (name === 'Country') {
          this.countries = newData;
        } else {
          console.error(`Name: ${name} does not match`);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
});
