import { defineStore } from 'pinia';
import {
  label,
  showTimeAs,
  regardingParent,
  user,
} from 'src/models/event/eventLists';
import { regardingContact } from 'src/models/event/eventLists';
import { Constants } from '../Constants';
import util from 'src/helpers/util';

export const useEventListsStore = defineStore('eventListsStore', {
  state: () => ({
    labels: [] as label[],
    regardingParent: [] as regardingParent[],
    showMyTimeAs: [] as showTimeAs[],
    users: [] as user[],
  }),

  getters: {
    Labels: (state) => state.labels,
    RegardingParent: (state) => state.regardingParent,
    ShowMyTimeAs: (state) => state.showMyTimeAs,
    Users: (state) => state.users,
  },

  actions: {
    async getEventLists() {
      const callStr = `${util.endPointUrl()}/event-lists`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);

        const eventLists = response.data[0];
        this.labels = eventLists.label;
        this.showMyTimeAs = eventLists.showTimeAs;
        this.regardingParent = eventLists.regardingParentTypes;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getFilteredUsers(searchString: string) {
      try {
        this.users = [];
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.endPointUrl()}/event-lists?user=${searchString}`
        );
        const userList = response.data.users;
        const filtered = userList.filter((t: regardingContact) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        await new Promise((r) => setTimeout(r, 500));
        this.users = filtered;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
