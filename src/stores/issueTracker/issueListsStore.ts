import { defineStore } from 'pinia';
import { Constants } from '../Constants';
import axios from 'axios';
import {
  issueCategory,
  issueCriticality,
  issueStatus,
  issueKind,
  issueLists,
  user,
} from 'src/models/issueTracker/issueLists';

export const useIssueListsStore = defineStore('issueListsStore', {
  state: () => ({
    category: [] as issueCategory[],
    criticality: [] as issueCriticality[],
    status: [] as issueStatus[],
    kind: [] as issueKind[],
    users: [] as user[],
  }),

  getters: {
    Category: (state) => state.category,
    Criticality: (state) => state.criticality,
    Status: (state) => state.status,
    Users: (state) => state.users,
    Kind: (state) => state.kind,
  },

  actions: {
    async getIssueLists() {
      try {
        const baseURL = 'http://localhost:3000/issue-lists';
        const response = await axios.get(baseURL);
        const issueLists: issueLists = response.data;
        this.category = issueLists.category;
        this.criticality = issueLists.criticality;
        this.status = issueLists.status;
        this.kind = issueLists.kind;
        this.users = issueLists.users;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    // async getFilteredUsers(searchString: string) {
    //   try {
    //     this.users = [];
    //     const response = await axios.get(
    //       'http://localhost:3000/issue-lists?users'
    //     );
    //     const userList = response.data[0].users;
    //     const filtered = userList.filter((t: regardingContact) => {
    //       return t.name.toLowerCase().includes(searchString.toLowerCase());
    //     });
    //     await new Promise((r) => setTimeout(r, 500));
    //     this.users = filtered;
    //   } catch (error) {
    //     Constants.throwError(error);
    //   }
    // },
  },
});
