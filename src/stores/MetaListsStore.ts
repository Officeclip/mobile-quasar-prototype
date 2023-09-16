import { defineStore } from 'pinia';
import { MetaLists } from '../models/Meta/metaLists';
import axios from 'axios';

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
        const data = await axios.get('http://localhost:4000/meta-lists');
        this.metaLists = data.data;
        console.log(`MetaList: ${this.metaLists}`);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
