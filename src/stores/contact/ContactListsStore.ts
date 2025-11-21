import { defineStore } from 'pinia';
import { State, Country, Children } from '../../models/Contact/contactsList';
import { Constants } from '../Constants';
import util from 'src/helpers/util';

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
    async getContactLists() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/contact-lists`,
        );
        const contactList = response.data[0];
        this.states = contactList.states;
        this.countries = contactList.countries;
        // this.children = contactList.children;
      } catch (error) {
        Constants.throwError(error);
      }
    },
    async getChildren() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/contact-children`,
        );
        this.children = response.data[0].children;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
