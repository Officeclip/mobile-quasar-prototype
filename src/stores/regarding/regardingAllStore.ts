import { defineStore } from 'pinia';
import { regardingContact } from '../../models/general/regardingAll';
import { Constants } from '../Constants';
import util from 'src/helpers/util';

export const useRegardingAllStore = defineStore('regardingAllStore', {
  state: () => ({
    regardingContacts: [] as regardingContact[],
    metaTypes: [],
  }),

  getters: {
    RegardingContacts: (state) => state.regardingContacts,
    MetaTypes: (state) => state.metaTypes,
  },

  actions: {
    getMetaTypes() {
      //TODO: CR: 2024-08-05: Can these be put in the constants file?
      const metaTypeOptions: any = [
        {
          id: -1,
          name: '',
        },
        {
          id: 1,
          name: 'Contacts',
        },
        {
          id: 2,
          name: 'Accounts',
        },
        {
          id: 3,
          name: 'Projects',
        },
        {
          id: 4,
          name: 'Campaigns',
        },
      ];
      try {
        this.metaTypes = metaTypeOptions;
      } catch (error) {
        console.error(error);
      }
    },

    async getRegardingContactListThatMatch(searchString: string) {
      try {
        this.regardingContacts = [];
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.endPointUrl()}/regardingContact`
        );
        const regardingContacts = response.data;
        const filtered = regardingContacts.filter((t: regardingContact) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        await new Promise((r) => setTimeout(r, 500));
        this.regardingContacts = filtered;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
