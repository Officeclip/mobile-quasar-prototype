import {defineStore} from 'pinia';
import {label, regardingContact} from 'src/models/event/eventLists';
import axios from 'axios';
import {Constants} from '../Constants';

export const useEventListsStore = defineStore('eventListsStore', {
  state: () => ({
    // timesheetList: undefined as TimesheetList | undefined,
    labels: [] as label[],
    regardingContacts: [] as regardingContact[],
  }),

  getters: {
    Labels: (state) => state.labels,
    RegardingContacts: (state) => state.regardingContacts,
  },

  actions: {
    async getEventLists() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/event-lists`
        );

        const eventLists = response.data;
        console.log('eventLists', eventLists);
        console.log('label', eventLists.label);

        this.labels = eventLists.label;
        this.regardingContacts = eventLists.regardingContact;
        console.log('Contacts from onMounted', this.regardingContacts);
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
        const eventLists = response.data;
        const regardingContacts = eventLists.regardingContact;
        const filtered = regardingContacts.filter((t: regardingContact) => {
          return t.name.toLowerCase().includes(searchString.toLowerCase());
        });
        console.log('getRegardingContactList: ', filtered);
        await new Promise(r => setTimeout(r, 2000));

        this.regardingContacts = filtered;
        // console.log("Filtered contacts: ", this.regardingContacts);
      } catch (error) {
        console.error(error);
      }
    },
  },
});
