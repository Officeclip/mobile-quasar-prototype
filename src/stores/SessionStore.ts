import { defineStore } from 'pinia';
import axios from 'axios';
import { Session } from 'src/models/session';
import { Constants } from 'stores/Constants';
import { SessionStorage } from 'quasar';
import { HomeIcon } from 'src/models/homeIcon';

export const useSessionStore = defineStore('sessionStore', {
  state: () => ({
    //session: {} as Session,
    //session: undefined as Session | undefined
  }),

  getters: {
    //Sessions: (state) => state.sessions, // see: https://stackoverflow.com/q/72151708
    // Session: (state) => state.session
    Session: () => SessionStorage.getItem('oc-session') as Session,
  },

  actions: {
    async getSession() {
      try {
        //TODO: user_id and org_id will be sent via the header for every call
        //TODO: *DO Not* load if session already exists
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(`${Constants.endPointUrl}/session`);
        if (response.data) {
          SessionStorage.set('oc-session', response.data);
          console.log('Sessions data from store: ', response.data);
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    getHomeIcons(): HomeIcon[] {
      const result = this.getDefaultHomeIcons().filter((item) => {
        return this.Session.applicationIds.includes(item.id);
      });

      // const result = this.getDefaultHomeIcons().filter((o1) =>
      //   this.Session.applicationIds.some((o2) => o1.id === o2)
      // );
      return result;
    },

    //TODO: CR: 2023-12-03: skd: Can this be put in a file? see: https://stackoverflow.com/q/67841588/89256
    // put the file in the data folder
    getDefaultHomeIcons(): HomeIcon[] {
      const defaultHomeIcons: HomeIcon[] = [
        {
          id: 1,
          name: 'Calendar',
          icon: 'calendar_month',
          url: '/eventSummary',
        },
        {
          id: 2,
          name: 'Contacts',
          icon: 'person',
          url: '/contactSummary',
        },
        {
          id: 3,
          icon: 'business_center',
          name: 'Accounts',
          url: '',
        },
        {
          id: 4,
          icon: 'request_quote',
          name: 'Opportunities',
          url: '',
        },
        {
          id: 5,
          icon: 'contact_mail',
          name: 'Campaigns',
          url: '',
        },
        {
          id: 6,
          icon: 'schedule',
          name: 'Timesheet',
          url: '/timesheetsAll',
        },
        {
          id: 7,
          icon: 'card_travel',
          name: 'Expenses',
          url: '/expensesAll',
        },
        {
          id: 8,
          icon: 'checklist',
          name: 'Tasks',
          url: '/tasksList',
        },
        {
          id: 9,
          icon: 'subject',
          name: 'Notes',
          url: '/notesList',
        },
        {
          id: 10,
          icon: 'support_agent',
          name: 'Support Desk',
          url: '',
        },
      ];
      return defaultHomeIcons;
    },
  },
});
