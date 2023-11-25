import { defineStore } from 'pinia';
import axios from 'axios';
import { Session } from 'src/models/session';
import { Constants } from 'stores/Constants';
import { SessionStorage } from 'quasar';

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
        //this.session = response.data;
        SessionStorage.set('oc-session', response.data);
        console.log('Sessions data from store: ', response.data);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
