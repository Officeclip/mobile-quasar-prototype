import { defineStore } from 'pinia';
import { bindersList } from '../../models/issueTracker/bindersList';
import axios from 'axios';

export const useIssueTrackerStore = defineStore('issueTrackerStore', {
  state: () => ({
    bindersList: {} as bindersList[],
  }),

  getters: {
    BindersList: (state) => state.bindersList,
  },

  actions: {
    async getbindersList() {
      const baseURL = 'http://localhost:3000/binders';

      const response = await axios.get(baseURL);
      this.bindersList = response.data;
    },
  },
});
