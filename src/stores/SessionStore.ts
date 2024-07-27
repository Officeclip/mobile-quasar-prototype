import { defineStore } from 'pinia';
import { Session } from 'src/models/session';
import { Constants } from 'stores/Constants';
import { SessionStorage } from 'quasar';
import { HomeIcon } from 'src/models/homeIcon';

export const useSessionStore = defineStore('sessionStore', {
  state: () => ({
    session: {} as Session,
  }),

  getters: {
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
          this.session = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    getHomeIcons(): HomeIcon[] {
      const defaultHomeIcons = this.getDefaultHomeIcons();
      const result = defaultHomeIcons.filter((item) => {
        return this.Session.applicationIds.includes(item.id);
      });
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
          id: 22,
          name: 'Contacts',
          icon: 'person',
          url: '/contactSummary',
        },
        // {
        //   id: 3,
        //   icon: 'business_center',
        //   name: 'Accounts',
        //   url: '',
        // },
        // {
        //   id: 4,
        //   icon: 'request_quote',
        //   name: 'Opportunities',
        //   url: '',
        // },
        // {
        //   id: 5,
        //   icon: 'contact_mail',
        //   name: 'Campaigns',
        //   url: '',
        // },
        {
          id: 8,
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
          id: 20,
          icon: 'checklist',
          name: 'Tasks',
          url: '/tasksList',
        },
        {
          id: 21,
          icon: 'subject',
          name: 'Notes',
          url: '/notesList',
        },
        // {
        //   id: 10,
        //   icon: 'support_agent',
        //   name: 'Support Desk',
        //   url: '',
        // },
      ];
      return defaultHomeIcons;
    },

    async changeOrganization(id: string) {
      const callStr = `${Constants.endPointUrl}/session/${id}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(callStr);
        if (response.status === 200) {
          this.session = response.data;
          await this.getSession();
        }
      } catch (error) {
        console.error(`addEventDetail Error: ${error}`);
      }
    },
  },
});
