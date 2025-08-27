import { defineStore } from 'pinia';
import { trackerBinderSummary } from '../../models/issueTracker/trackerBinderSummary';
import { Constants } from '../Constants';
import util from 'src/helpers/util';

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
        try {
          const instance = Constants.getAxiosInstance();
          const response = await instance.get(
            `${util.getEndPointUrl()}/tracker-binder-summary`,
          );
          this.trackerBindersList = response.data;
        } catch (error) {
          Constants.throwError(error);
        }
      },
    },
  },
);
