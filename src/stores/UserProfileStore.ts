import {defineStore} from 'pinia';
import axios from 'axios';
import {UserProfile} from 'src/models/UserProfile';

export const useUserProfileStore = defineStore('userProfileStore', {
  state: () => ({
    userProfiles: [] as UserProfile[],
  }),

  getters: {
    UserProfiles: (state) => state.userProfiles, // see: https://stackoverflow.com/q/72151708
  },

  actions: {
    async getUserProfiles() {
      try {
        const data = await axios.get('http://localhost:4000/generaluserprofile');
        this.userProfiles = data.data;
        console.log('userProfiles data from store: ', data.data);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
