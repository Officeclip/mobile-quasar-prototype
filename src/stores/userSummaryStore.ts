import { defineStore } from 'pinia';
import { userSummary } from 'src/models/userSummary';
import { Constants } from 'stores/Constants';

export const useUserSummaryStore = defineStore('userSummaryStore', {
  state: () => ({
    userSummaries: [] as userSummary[],
  }),

  getters: {
    UserSummaries: (state) => state.userSummaries, // see: https://stackoverflow.com/q/72151708
  },

  actions: {
    async getUserSummaries() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/user-summary`
        );
        this.userSummaries = response.data;
      } catch (error) {
        Constants.throwError(error);
        // alert(error);
        // console.log(error);
      }
    },
  },
});
