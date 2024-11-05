import { defineStore } from 'pinia';
import { Constants } from '../Constants';
import axios from 'axios';
import {
  issueStatus,
  issueCriticality,
  issueCategory,
  issueKind,
  trackerLists,
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
    regardingContact: [] as regardingContact[],
  }),

  getters: {
    Status: (state) => state.status,
    Criticality: (state) => state.criticality,
    Category: (state) => state.category,
    Kind: (state) => state.kind,
    Users: (state) => state.users,
    RegardingContact: (state) => state.regardingContact,
  },

  actions: {
    async getTrackerLists(binderId: string) {
      // try {
      //   const baseURL = 'http://localhost:3000/issue-lists';
      //   const response = await axios.get(baseURL);
      //   const issueLists: issueLists = response.data;
      //   this.category = issueLists.category;
      //   this.criticality = issueLists.criticality;
      //   this.status = issueLists.status;
      //   this.kind = issueLists.kind;
      //   this.users = issueLists.users;
      // } catch (error) {
      //   Constants.throwError(error);
      // }
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.endPointUrl()}/tracker-lists?binderSid=${binderId}`
        );
        const trackerLists: trackerLists = response.data[0];
        this.status = trackerLists.status;
        this.criticality = trackerLists.criticality;
        this.kind = trackerLists.kind;
        this.users = trackerLists.users;
        this.regardingContact = trackerLists.regardingContact;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getFilteredUsers(searchString: string) {
      try {
        this.users = [];
        const response = await axios.get(
          'http://localhost:3000/issue-lists?users'
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
