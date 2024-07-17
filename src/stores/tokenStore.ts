import { defineStore } from 'pinia';
import { Token } from '../models/token';
import { Login } from '../models/login';
import { Constants } from './Constants';

export const useTokenStore = defineStore('loginStore', {
  state: () => ({
    token: {} as Token,
  }),

  getters: {
    Token: (state) => state.token,
  },

  actions: {
    async validateLogin(login: Login, pin: string) {
      // We will assume that the login is successful and it returns the token in the body
      // this will happen in the actual call, so we will bypass this for now as json-server
      // cannot process what we are trying to do.

      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${Constants.endPointUrl}/login`,
          pin && pin.length > 0 ? pin : login
        );
        //TODO: 20240306: skd: nk: the token and expiration date is returning as undefined in mockoon we need to fix it
        if (response.data) {
          this.token = response.data;
          Constants.saveAuthorizationTokenInLocalStorage(
            this.token.accessToken,
            this.token.expirationTime
          );
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
