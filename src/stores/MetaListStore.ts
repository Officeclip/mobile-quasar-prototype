import { defineStore } from 'pinia';
import { MetaList } from '../models/metaList';
import axios from 'axios';

export const useMetaListStore = defineStore('metaListStore', {
  state: () => ({
    metaLists: [] as MetaList[],
  }),

  getters: {
    MetaLists: (state) => state.metaLists,
    ListItems: (state) => (metaId: number) =>
      state.metaLists.filter((x) => x.metaId == metaId)[0].listItems,
  },

  actions: {
    async getMetaLists() {
      try {
        const data = await axios.get('http://localhost:4000/metaList');
        this.metaLists = data.data;
        console.log(`MetaList: ${this.metaLists}`);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
