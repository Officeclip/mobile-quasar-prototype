import {defineStore} from 'pinia';
import {regardingItem} from 'src/models/general/regardingItem';
import axios from 'axios';
import {Constants} from '../Constants';

export const useRegardingStore = defineStore('regardingStore', {
  state: () => ({
    regardingItems: new Map<string, regardingItem[]>(),
    regardingContacts: [] as regardingItem[],
    metaTypes: [],
  }),

  getters: {
    RegardingContacts: (state) => state.regardingContacts,
    RegardingItems: (state) => state.regardingItems,
    MetaTypes: (state) => state.metaTypes,
  },

  actions: {
    getMetaTypes() {
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

    async getRegardingItemsThatMatch(searchString: string, type: string) {
      try {
        this.regardingItems.set(type, []);
        const response = await axios.get(
          `${Constants.endPointUrl}/regarding/type?searchString=${searchString}`
        );
        const regardingItems = response.data;
        const filtered = regardingItems.filter((t: regardingItem) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        console.log('getRegardingContactList: ', filtered);
        await new Promise((r) => setTimeout(r, 500));
        this.regardingItems.set(type, filtered);
        // console.log("Filtered contacts: ", this.regardingContacts);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
