import { defineStore } from 'pinia';
import { Constants } from 'stores/Constants';
import { profileLists } from 'src/models/general/profileLists';
import util from 'src/helpers/util';

export const useProfileListsStore = defineStore('profileListsStore', {
  state: () => ({
    profileLists: {} as profileLists,
  }),

  getters: {
    ProfileLists: (state) => state.profileLists,
    Organizations: (state) => state.profileLists.organization,
    ProfilesUserGeneral: (state) => state.profileLists.profiles.user.general,
  },

  actions: {
    async getProfileLists() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.endPointUrl()}/profile-lists`
        );
        if (response.data) {
          this.profileLists = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
