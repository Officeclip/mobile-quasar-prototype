import { defineStore } from 'pinia';
import { Constants } from '../stores/Constants';
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
    clearProfileLists() {
      this.profileLists = {} as profileLists;
    },

    async getProfileLists(): Promise<void> {
      try {
        const instance = Constants.getAxiosInstance();
        const { data: result } = await instance.get(
          `${util.getEndPointUrl()}/profile-lists`,
        );

        if (result?.profiles?.user?.general?.userPhoto) {
          try {
            const iconId = result.profiles.user.general.userPhoto;
            const { data: iconData } = await instance.get(
              `${util.getEndPointUrl()}/image-detail`,
              { params: { id: iconId } },
            );
            result.profiles.user.general.userPhoto = `data:image/${iconData.srcType};base64,${iconData.src}`;
          } catch (iconError) {
            Constants.throwError(iconError);
          }
        }
        console.log('Profile lists fetched:', result);

        this.profileLists = result;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
