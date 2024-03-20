import { defineStore } from 'pinia';
import {
  label,
  ShowTimeAs,
  regardingParent,
  // timeZone,
  user,
} from 'src/models/event/eventLists';
import { regardingContact } from 'src/models/event/eventLists';
import axios from 'axios';
import { Constants } from '../Constants';

export const useEventListsStore = defineStore('eventListsStore', {
  state: () => ({
    // timesheetList: undefined as TimesheetList | undefined,
    labels: [] as label[],
    regardingParent: [] as regardingParent[],
    // timeZones: [] as timeZone[],
    showMyTimeAs: [] as ShowTimeAs[],
    users: [] as user[],
  }),

  getters: {
    Labels: (state) => state.labels,
    RegardingParent: (state) => state.regardingParent,
    // TimeZones: (state) => state.timeZones,
    ShowMyTimeAs: (state) => state.showMyTimeAs,
    Users: (state) => state.users,
  },

  actions: {
    async getEventLists() {
      const ShowMyTimeAsOptions: any = [
        {
          id: '1',
          name: 'Busy',
          color: '#FF6347',
        },
        {
          id: '2',
          name: 'Free',
          color: '#B4B4B4',
        },
        {
          id: '3',
          name: 'Tentative',
          color: '#FFA500',
        },
        {
          id: '4',
          name: 'Out of Office',
          color: '#6A5ACD',
        },
      ];
      const callStr = `${Constants.endPointUrl}/event-lists`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);

        const eventLists = response.data[0];
        console.log('eventLists', eventLists);
        console.log('label', eventLists.label);

        this.labels = eventLists.label;
        // this.timeZones = eventLists.timezone;
        this.timeZones = eventLists.timezone.map((item: any) => ({
          id: item.id,
          name: `${item.name} ${item.standard_id}`,
          locations: item.locations,
        }));
        this.showMyTimeAs = ShowMyTimeAsOptions;
        this.regardingParent = eventLists.regardingParentTypes;
      } catch (error) {
        console.error(error);
      }
    },
    // async getRegardingContactList(searchString: string){
    //   try {
    //     const instance = Constants.getAxiosInstance();
    //    const response = await instance.get(
    //         `${Constants.endPointUrl}/event-lists/`
    //     );
    //     const eventLists = response.data[0];
    //     // this.labels = eventLists.labels;
    //     const contacts = eventLists.regardingContacts;
    //
    //     this.regardingContacts = contacts.filter((t) => {
    //       return t.name.includes(searchString);
    //     });
    //     console.log("Filtered contacts: ", this.regardingContacts);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
    // getRegardingContactList(
    //   searchString: string
    // ): regardingContact[] | undefined {
    //   try {
    //     const filtered = this.regardingContacts.filter((t) => {
    //       return t.name.toLowerCase().includes(searchString.toLowerCase());
    //     });
    //     console.log('getRegardingContactList: ', filtered);
    //     return filtered;
    //     // console.log("Filtered contacts: ", this.regardingContacts);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },

    // async getRegardingContactListThatMatch(searchString: string) {
    //   try {
    //     this.regardingContacts = [];
    //     const instance = Constants.getAxiosInstance();
    //    const response = await instance.get(
    //       `${Constants.endPointUrl}/event-lists`
    //     );
    //     const eventLists = response.data[0];
    //     const regardingContacts = eventLists.regardingContact;
    //     const filtered = regardingContacts.filter((t: regardingContact) => {
    //       return t.name.toLowerCase().includes(searchString.toLowerCase());
    //     });
    //     console.log('getRegardingContactList: ', filtered);
    //     await new Promise((r) => setTimeout(r, 500));
    //     this.regardingContacts = filtered;
    //     // console.log("Filtered contacts: ", this.regardingContacts);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    async getFilteredUsers(searchString: string) {
      try {
        this.users = [];
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/event-lists?user=${searchString}`
        );
        const userList = response.data.users;
        const filtered = userList.filter((t: regardingContact) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        console.log('userList: ', filtered);
        await new Promise((r) => setTimeout(r, 500));
        this.users = filtered;
        // console.log("Filtered contacts: ", this.regardingContacts);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
