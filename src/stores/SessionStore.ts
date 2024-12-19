import { defineStore } from 'pinia';
import { Session } from 'src/models/session';
import { Constants } from 'stores/Constants';
import { SessionStorage } from 'quasar';
import { HomeIcon } from 'src/models/homeIcon';
import util from 'src/helpers/util';

export const useSessionStore = defineStore('sessionStore', {
  state: () => ({
    session: null as Session | null,
    defaultHomeIcons: [
      //defaultHomeIcons data remains in the store
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
      {
        id: 22,
        icon: 'bug_report',
        name: 'IssueTracker',
        url: '/trackerBinderSummary',
      },
    ] as HomeIcon[],
  }),

  getters: {
    Session: (state) =>
      state.session || (SessionStorage.getItem('oc-session') as Session),
  },

  actions: {
    async isValidUrl(urlString: string): Promise<boolean> {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(`${urlString}/isValid`);
        return response.status === 200;
      } catch (error) {
        return false;
      }
    },

    async getSession() {
      try {
        //TODO: user_id and org_id will be sent via the header for every call
        //TODO: *DO Not* load if session already exists (add check here)
        if (this.session) return;

        const instance = Constants.getAxiosInstance();
        const response = await instance.get(`${util.endPointUrl()}/session`);
        if (response.data) {
          this.session = response.data;
          SessionStorage.set('oc-session', response.data);
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    getHomeIcons(): HomeIcon[] {
      const session = this.Session;
      return this.defaultHomeIcons.filter((item) =>
        session.applicationIds.includes(item.id)
      );
    },

    async changeOrganization(id: string) {
      const callStr = `${util.endPointUrl()}/session/${id}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(callStr);
        if (response.status === 200) {
          await this.getSession();
        }
      } catch (error) {
        console.error(`changeOrganization Error: ${error}`);
      }
    },
  },
});
