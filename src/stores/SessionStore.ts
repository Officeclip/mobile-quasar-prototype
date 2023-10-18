import {defineStore} from 'pinia';
import axios from 'axios';
import {Session} from 'src/models/session';
import {Constants} from "stores/Constants";

export const useSessionStore = defineStore('sessionStore', {
  state: () => ({
    sessions: [] as Session[],
  }),

  getters: {
    Sessions: (state) => state.sessions, // see: https://stackoverflow.com/q/72151708
  },

  actions: {
    async getSessions() {
      try {
        const data = await axios.get(`${Constants.endPointUrl}/session`);
        this.sessions = data.data;
        console.log('Sessions data from store: ', data.data);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
