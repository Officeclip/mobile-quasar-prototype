import { defineStore } from 'pinia';
import { State, Country, Children } from '../../models/Contact/contactsList';
import { Constants } from '../Constants';
import util from 'src/helpers/util';

export const useAccountListsStore = defineStore('accountListsStore', {
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
    async getAccountLists() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/account-lists`,
        );
        const accountList = response.data[0];
        this.states = accountList.states;
        this.countries = accountList.countries;
        this.children = accountList.children;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
