import { defineStore } from 'pinia';
import axios from 'axios';
import { Session } from 'src/models/session';

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
        const data = await axios.get('http://localhost:4000/session');
        this.sessions = data.data;
        console.log('Test: ', data.data);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
