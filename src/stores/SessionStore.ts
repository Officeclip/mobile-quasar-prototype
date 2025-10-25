import { defineStore } from 'pinia';
import { Session } from 'src/models/session';
import { Constants } from '../stores/Constants';
import { SessionStorage } from 'quasar';
import { HomeIcon } from 'src/models/homeIcon';
import util from 'src/helpers/util';

import { useTokenStore } from './tokenStore';
import { useProfileListsStore } from './profileListsStore';
import { useImageDetailStore } from './ImageDetail';

export const useSessionStore = defineStore('sessionStore', {
  state: () => ({
    session: {} as Session,
  }),

  getters: {
    Session: (state) => {
      // First check state, then fallback to SessionStorage
      if (state.session && Object.keys(state.session).length > 0) {
        return state.session;
      }
      return SessionStorage.getItem('oc-session') as Session;
    },
  },

  actions: {
    logout() {
      const tokenStore = useTokenStore();
      const profileListsStore = useProfileListsStore();
      const imageDetailStore = useImageDetailStore();

      this.clearSession();
      tokenStore.clearToken();
      profileListsStore.clearProfileLists();
      imageDetailStore.resetImageDetail();
    },

    clearSession() {
      this.session = {} as Session;
      SessionStorage.remove('oc-session');
    },
    // Enhanced URL validation function
    isValidUrlFormat(urlString: string): boolean {
      if (typeof urlString !== 'string' || !urlString.trim()) {
        return false;
      }

      urlString = urlString.trim();

      // Ensure the URL starts with http:// or https://
      if (!/^https?:\/\/.+/i.test(urlString)) {
        return false;
      }

      try {
        const url = new URL(urlString);
        // Only allow http and https protocols
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },

    async isValidUrl(urlString: string): Promise<boolean> {
      // Validate URL format first
      if (!this.isValidUrlFormat(urlString)) {
        console.warn('Invalid URL format:', urlString);
        return false;
      }

      try {
        const instance = Constants.getAxiosInstance();
        const endpoint = `${urlString.replace(/\/+$/, '')}/isValid`;

        const response = await instance.get(endpoint, {
          validateStatus: (status: number) => status === 200,
        });

        return response.status === 200;
      } catch (error) {
        console.error('URL validation error:', error);
        return false;
      }
    },

    async getSession() {
      try {
        // Check if session already exists
        const existingSession = SessionStorage.getItem('oc-session') as Session;
        if (existingSession && existingSession.applicationIds) {
          this.session = existingSession;
          return;
        }

        //TODO: user_id and org_id will be sent via the header for every call
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

      // Add null check for Session
      const session = this.Session;
      if (!session || !session.applicationIds) {
        console.warn('Session or applicationIds not available');
        return [];
      }

      const result = defaultHomeIcons.filter((item) => {
        return session.applicationIds.includes(item.id);
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
          // Clear all cached data to ensure fresh data for new organization
          SessionStorage.clear();
          // this.session = {} as Session;

          // Fetch new session data for the new organization
          await this.getSession();

          // Force complete page reload to ensure all stores and components refresh
          // window.location.reload();
        } else {
          throw new Error(`Server returned status: ${response.status}`);
        }
      } catch (error) {
        console.error(`changeOrganization Error: ${error}`);
        throw error;
      }
    },
  },
});
