import { defineStore } from 'pinia';
import { regardingItem } from 'src/models/general/regardingItem';
import { Constants } from '../Constants';
import util from 'src/helpers/util';

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
      //TODO: CR: 2024-08-05: can these be put in the constants
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

    async getRegardingItemsThatMatch(searchString: string, type: any) {
      try {
        this.regardingItems = [];
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/regarding?parentType=${
            type.name
          }&searchString=${searchString}`
        );
        const regardingItems = response.data;
        const filtered = regardingItems.filter((t: regardingItem) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        await new Promise((r) => setTimeout(r, 500));
        this.regardingItems = filtered;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
