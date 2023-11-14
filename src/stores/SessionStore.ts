import { defineStore } from 'pinia';
import axios from 'axios';
import { Session } from 'src/models/session';
import { Constants } from 'stores/Constants';
import { SessionStorage } from 'quasar';

export const useSessionStore = defineStore('sessionStore', {
  state: () => ({
    sessions: [] as Session[],
    //session: undefined as Session | undefined
  }),

  getters: {
    Sessions: (state) => state.sessions, // see: https://stackoverflow.com/q/72151708
    // Session: (state) => state.session
    Session: () => SessionStorage.getItem('oc-session'),
  },

  actions: {
    async getSession() {
      try {
        // user_id and org_id will be sent via the header for every call
        // *DO Not* load if session already exists
        const response = await axios.get(`${Constants.endPointUrl}/session`);
        this.sessions = response.data;
        SessionStorage.set('oc-session', response.data[0]);
        console.log('Sessions data from store: ', response.data[0]);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
