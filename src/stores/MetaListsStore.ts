import { defineStore } from 'pinia';
import { MetaLists } from '../models/Meta/metaLists';
import axios from 'axios';
import { Constants } from 'stores/Constants';

export const useMetaListsStore = defineStore('metaListsStore', {
  state: () => ({
    metaLists: [] as MetaLists[],
  }),

  getters: {
    MetaLists: (state) => state.metaLists,
    ListItems: (state) => (metaId: number) =>
      state.metaLists.filter((x) => x.metaId == metaId)[0].listItems,
  },

  actions: {
    async getMetaLists() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}meta-lists`
        );
        this.metaLists = response.data;
        console.log(`MetaList: ${this.metaLists}`);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
