import { defineStore } from 'pinia';
import { State, Country, Children } from '../models/Contact/contactsList';
import axios from 'axios';
import { Constants } from './Constants';

export const useContactListsStore = defineStore('contactListsStore', {
  state: () => ({
    // timesheetList: undefined as TimesheetList | undefined,
    states: [] as State[],
    countries: [] as Country[],
    children: [] as Children[],
  }),

  getters: {
    States: (state) => state.states,
    Countries: (state) => state.countries,
    Children: (state) => state.children,
  },

  actions: {
    // getting all the timesheets for testing only, probably no where this use
    // TODO: Get all the list item at one time.
    async getContactList() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/contact-lists`
        );
        const contactList = response.data[0];
        //this.timesheetList = timesheetList;
        //debugger;
        this.states = contactList.states;
        this.countries = contactList.countries;
        this.children = contactList.children;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
