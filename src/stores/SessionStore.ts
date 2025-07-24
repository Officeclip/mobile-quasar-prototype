import { defineStore } from 'pinia';
import { Session } from 'src/models/session';
import { Constants } from '../stores/Constants';
import { SessionStorage } from 'quasar';
import { HomeIcon } from 'src/models/homeIcon';
import util from 'src/helpers/util';

export const useSessionStore = defineStore('sessionStore', {
  state: () => ({
    session: {} as Session,
  }),

  getters: {
    Session: () => SessionStorage.getItem('oc-session') as Session,
  },

  actions: {
    async isValidUrl(urlString: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(`${urlString}/isValid`);
        if ((response.status = 200)) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },

    async getSession() {
      try {
        //TODO: user_id and org_id will be sent via the header for every call
        //TODO: *DO Not* load if session already exists
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(`${util.getEndPointUrl()}/session`);
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
          color: 'primary', // Blue, represents scheduling & planning
        },
        {
          id: 22,
          name: 'Contacts',
          icon: 'person',
          url: '/contactSummary',
          color: 'teal', // Friendly, represents communication & connection
        },
        {
          id: 8,
          icon: 'schedule',
          name: 'Timesheet',
          url: '/timesheetsAll',
          color: 'amber', // Represents time tracking & productivity
        },
        {
          id: 7,
          icon: 'card_travel',
          name: 'Expenses',
          url: '/expensesAll',
          color: 'green', // Money/financial, represents transactions
        },
        {
          id: 20,
          icon: 'checklist',
          name: 'Tasks',
          url: '/tasksList',
          color: 'purple', // Represents organization & completion
        },
        {
          id: 21,
          icon: 'subject',
          name: 'Notes',
          url: '/notesList',
          color: 'orange', // Represents ideas & creativity
        },
        {
          id: 5,
          icon: 'bug_report',
          name: 'Issue Tracker',
          url: '/trackerBinderSummary',
          color: 'red', // Represents errors & alerts
        },
        {
          id: 10,
          icon: 'alarm_off',
          name: 'Time Off',
          url: '/timeOffSummary',
          color: 'light-blue', // Represents relaxation & freedom
        },
      ];
      return defaultHomeIcons.slice().sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    },

    async changeOrganization(id: string) {
      const callStr = `${util.getEndPointUrl()}/session/${id}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(callStr);
        if (response.status === 200) {
          await this.getSession();
          window.location.reload();
        }
      } catch (error) {
        console.error(`addEventDetail Error: ${error}`);
      }
    },
  },
});
