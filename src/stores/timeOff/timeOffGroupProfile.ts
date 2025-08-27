import { defineStore } from 'pinia';
import { TimeOffGroupProfile } from 'src/models/TimeOff/groupProfile';
import { Constants } from '../Constants';
import util from 'src/helpers/util';

export const useTimeOffgroupProfile = defineStore('timeOffgroupProfile', {
  state: () => ({
    timeOffGroupProfile: {} as TimeOffGroupProfile,
  }),

  getters: {
    TimeOffgroupProfile: (state) => state.timeOffGroupProfile,
  },

  actions: {
    async getTimeOffGroupProfile() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/timeoff-group-profile`,
        );
        const newData = response.data[0];
        this.timeOffGroupProfile = newData;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
