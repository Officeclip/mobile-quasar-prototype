import { defineStore } from 'pinia';
import logger from 'src/helpers/logger';
import util from 'src/helpers/util';
import { UserProfile } from 'src/models/UserProfile';
import { Constants } from 'stores/Constants';

export const useUserProfileStore = defineStore('userProfileStore', {
  state: () => ({
    userProfile: {} as UserProfile,
  }),

  getters: {
    UserProfile: (state) => state.userProfile, // see: https://stackoverflow.com/q/72151708
  },

  actions: {
    async getUserProfiles() {
      try {
        const instance = Constants.getAxiosInstance();
        const data = await instance.get(
          `${util.endPointUrl()}/generaluserprofile`
        );
        this.userProfile = data.data;
      } catch (error: any) {
        alert(error);
        logger.log(error);
      }
    },
  },
});
