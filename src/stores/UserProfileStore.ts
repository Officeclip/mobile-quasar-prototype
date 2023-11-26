import { defineStore } from 'pinia';
import axios from 'axios';
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
          `${Constants.endPointUrl}/generaluserprofile`
        );
        //debugger;
        this.userProfile = data.data;
        console.log('userProfiles data from store: ', this.userProfile);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
