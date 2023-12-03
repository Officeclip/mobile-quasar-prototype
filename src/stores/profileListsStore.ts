import { defineStore } from 'pinia';
import { Constants } from 'stores/Constants';
import { profileLists } from 'src/models/general/profileLists';

export const useProfileListsStore = defineStore('profileListsStore', {
  state: () => ({
    profileLists: {} as profileLists,
  }),

  getters: {
    ProfileLists: (state) => state.profileLists,
    Organizations: (state) => state.profileLists.organizations,
    ProfilesUserGeneral: (state) => state.profileLists.profiles.user.general,
    ProfilesGroupTimesheet: (state) =>
      state.profileLists.profiles.group.timesheet,
  },

  actions: {
    async getProfileLists() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/profileLists`
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
