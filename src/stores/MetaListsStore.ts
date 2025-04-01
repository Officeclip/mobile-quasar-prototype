import { defineStore } from 'pinia';
import { MetaLists } from '../models/Meta/metaLists';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util';

export const useMetaListsStore = defineStore('metaListsStore', {
  state: () => ({
    metaLists: [] as MetaLists[],
    metaLists_N: [] as MetaLists[],
  }),

  getters: {
    MetaLists: (state) => state.metaLists,
    ListItems: (state) => (metaId: number) =>
      state.metaLists.filter((x) => x.metaId == metaId)[0].listItems,
    MetaLists_N: (state) => state.metaLists_N,
  },

  actions: {
    async getMetaLists() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}meta-lists`
        );
        this.metaLists = response.data;
      } catch (error: any) {
        alert(error);
      }
    },
    // March 01, 2025 implementing the meta lists by Sudhakar need to review after done
    async getMetaLists_N() {
      const response = await fetch('data/mock_data.json');
      const mockData = await response.json();
      this.metaLists_N = mockData['meta-lists'] as MetaLists[];
    },
  },
});
