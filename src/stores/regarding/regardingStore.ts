import { defineStore } from 'pinia';
import { regardingItem } from 'src/models/general/regardingItem';
import axios from 'axios';
import { Constants } from '../Constants';

export const useRegardingStore = defineStore('regardingStore', {
  state: () => ({
    regardingItems: [] as regardingItem[],
    metaTypes: [],
  }),

  getters: {
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
        this.regardingItems = [];
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/regarding?type=${type}&search_str=${searchString}`
        );
        //const instance = Constants.getAxiosInstance();
        // const response1 = await instance.get(
        //   `${Constants.endPointUrl}/regarding`
        // );
        const regardingItems = response.data;
        console.log('getRegardingList: ', regardingItems[0]);

        const filtered = regardingItems.filter((t: regardingItem) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        console.log('getRegardingList: ', filtered);
        await new Promise((r) => setTimeout(r, 500));
        this.regardingItems = filtered;
        // console.log("Filtered contacts: ", this.regardingContacts);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
