import { defineStore } from 'pinia';
import { Constants } from '../Constants';
import {
  issueStatus,
  issueCriticality,
  issueCategory,
  issueKind,
  trackerLists,
  regardingParent,
  user,
} from 'src/models/issueTracker/issueLists';
import { regardingContact } from 'src/models/issueTracker/issueLists';
import util from 'src/helpers/util';

export const useIssueListsStore = defineStore('issueListsStore', {
  state: () => ({
    status: [] as issueStatus[],
    criticality: [] as issueCriticality[],
    category: [] as issueCategory[],
    kind: [] as issueKind[],
    users: [] as user[],
    regardingParent: [] as regardingParent[],
  }),

  getters: {
    Status: (state) => state.status,
    Criticality: (state) => state.criticality,
    Category: (state) => state.category,
    Kind: (state) => state.kind,
    Users: (state) => state.users,
    RegardingParent: (state) => state.regardingParent,
  },

  actions: {
    async getTrackerLists(binderId: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.endPointUrl()}/tracker-lists?binderSid=${binderId}`
        );
        const trackerLists: trackerLists = response.data[0];
        this.status = trackerLists.status;
        this.criticality = trackerLists.criticality;
        this.category = trackerLists.category;
        this.kind = trackerLists.kind;
        this.users = trackerLists.users;
        this.regardingParent = trackerLists.regardingParentTypes;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getFilteredUsers(binderId: string, searchString: string) {
      try {
        this.users = [];
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.endPointUrl()}/tracker-lists?binderSid=${binderId}`
        );
        const userList = response.data[0].users;
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
