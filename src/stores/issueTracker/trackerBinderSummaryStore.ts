import { defineStore } from 'pinia';
import { trackerBinderSummary } from '../../models/issueTracker/trackerBinderSummary';
import axios from 'axios';

export const useTrackerBinderSummaryStore = defineStore(
  'trackerBinderSummaryStore',
  {
    state: () => ({
      trackerBindersList: {} as trackerBinderSummary[],
    }),

    getters: {
      TrackerBindersList: (state) => state.trackerBindersList,
    },

    actions: {
      async getTrackerBindersList() {
        const baseURL = 'http://localhost:3000/binders';

        const response = await axios.get(baseURL);
        this.trackerBindersList = response.data;
      },
    },
  }
);
