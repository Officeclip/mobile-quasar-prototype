import { defineStore } from 'pinia';
import { MetaLists } from '../models/Meta/metaLists';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util';

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
        const response = await instance.get(`${util.endPointUrl()}meta-lists`);
        this.metaLists = response.data;
      } catch (error: any) {
        alert(error);
      }
    },
  },
});
