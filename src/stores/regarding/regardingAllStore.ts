import { defineStore } from 'pinia';
import { regardingContact } from '../../models/general/regardingAll';
import axios from 'axios';
import { Constants } from '../Constants';

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
    getEventLists() {
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
    // getRegardingContactList(
    //   searchString: string
    // ): regardingContact[] | undefined {
    //   try {
    //     const filtered = this.regardingContacts.filter((t) => {
    //       return t.name.toLowerCase().includes(searchString.toLowerCase());
    //     });
    //     console.log('getRegardingContactList: ', filtered);
    //     return filtered;
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },

    async getRegardingContactListThatMatch(searchString: string) {
      try {
        this.regardingContacts = [];
        const response = await axios.get(
          `${Constants.endPointUrl}/regardingContact`
        );
        const regardingAllData = response.data[0];
        const regardingContacts = regardingAllData;
        const filtered = regardingContacts.filter((t: regardingContact) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        console.log('getRegardingContactList: ', filtered);
        await new Promise((r) => setTimeout(r, 500));
        this.regardingContacts = filtered;
        // console.log("Filtered contacts: ", this.regardingContacts);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
