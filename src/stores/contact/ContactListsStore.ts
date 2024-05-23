import { defineStore } from 'pinia';
import { State, Country, Children } from '../../models/Contact/contactsList';
import { Constants } from '../Constants';

export const useContactListsStore = defineStore('contactListsStore', {
  state: () => ({
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
    async getContactList() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/contact-lists`
        );
        const contactList = response.data[0];
        this.states = contactList.states;
        this.countries = contactList.countries;
        this.children = contactList.children;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
