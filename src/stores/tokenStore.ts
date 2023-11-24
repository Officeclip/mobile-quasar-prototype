import { defineStore } from 'pinia';
import { Token } from '../models/token';
import { Login } from '../models/login';
import axios from 'axios';
import { Constants } from './Constants';

export const useTokenStore = defineStore('loginStore', {
  state: () => ({
    token: {} as Token,
  }),

  getters: {
    Token: (state) => state.token,
  },

  actions: {
    async validateLogin(login: Login) {
      // We will assume that the login is successful and it returns the token in the body
      // this will happen in the actual call, so we will bypass this for now as json-server
      // cannot process what we are trying to do.
      try {
        const response = await axios.post(
          `${Constants.endPointUrl}/login`,
          login
        );
        if (response.data && response.data.length > 0) {
          this.token = response.data[0];
        }

        const response2 = await axios.get(`${Constants.endPointUrl}/token`);
        if (response2.data && response2.data.length > 0) {
          this.token = response2.data[0];
        }
      } catch (error) {
        console.log(JSON.stringify(error));
        if (axios.isAxiosError(error)) {
          throw `Axios error: ${error.message}`;
        }
        throw 'Error: ' + (error as string);
      }
    },
  },
});
