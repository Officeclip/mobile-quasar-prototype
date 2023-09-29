import { defineStore } from 'pinia';
import { label, regardingContact, timeZone } from 'src/models/event/eventLists';
import axios from 'axios';
import { Constants } from '../Constants';

export const useEventListsStore = defineStore('eventListsStore', {
  state: () => ({
    // timesheetList: undefined as TimesheetList | undefined,
    labels: [] as label[],
    regardingContacts: [] as regardingContact[],
    timeZones: [] as timeZone[],
    showMyTimeAs: [],
  }),

  getters: {
    Labels: (state) => state.labels,
    RegardingContacts: (state) => state.regardingContacts,
    TimeZones: (state) => state.timeZones,
    ShowMyTimeAs: (state) => state.showMyTimeAs,
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
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/event-lists`
        );

        const eventLists = response.data[0];
        console.log('eventLists', eventLists);
        console.log('label', eventLists.label);

        this.labels = eventLists.label;
        this.timeZones = eventLists.timezone;
        this.showMyTimeAs = ShowMyTimeAsOptions;
        // this.regardingContacts = eventLists.regardingContact;
        console.log(
          'checking the loacl store showtimeas options',
          this.showMyTimeAs
        );
      } catch (error) {
        console.error(error);
      }
    },
    // async getRegardingContactList(searchString: string){
    //   try {
    //     const response = await axios.get(
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
    getRegardingContactList(
      searchString: string
    ): regardingContact[] | undefined {
      try {
        const filtered = this.regardingContacts.filter((t) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        console.log('getRegardingContactList: ', filtered);
        return filtered;
        // console.log("Filtered contacts: ", this.regardingContacts);
      } catch (error) {
        console.error(error);
      }
    },

    async getRegardingContactListThatMatch(searchString: string) {
      try {
        this.regardingContacts = [];
        const response = await axios.get(
          `${Constants.endPointUrl}/event-lists`
        );
        const eventLists = response.data[0];
        const regardingContacts = eventLists.regardingContact;
        const filtered = regardingContacts.filter((t: regardingContact) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        console.log('getRegardingContactList: ', filtered);
        await new Promise((r) => setTimeout(r, 2000));
        this.regardingContacts = filtered;
        // console.log("Filtered contacts: ", this.regardingContacts);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
