import { defineStore } from 'pinia';
import { Token } from '../models/token';
import { Login } from '../models/login';
import { Constants } from './Constants';
import util from 'src/helpers/util';

export const useTokenStore = defineStore('loginStore', {
  state: () => ({
    token: {} as Token,
  }),

  getters: {
    Token: (state) => state.token,
  },

  actions: {
    clearToken() {
      this.token = {} as Token;
      LocalStorage.remove('X-Token');
    },
    async validateLogin(login: Login, mpin: string | null) {
      // We will assume that the login is successful and it returns the token in the body
      // this will happen in the actual call, so we will bypass this for now as json-server
      // cannot process what we are trying to do.

      try {
        const instance = Constants.getAxiosInstance();
        login.mpin = null;
        if (mpin && mpin.length > 0) {
          login.userName = null;
          login.password = null;
          login.mpin = mpin;
        }
        const response = await instance.post(
          `${util.getEndPointUrl()}/login`,
          login,
        );
        //TODO: 20240306: skd: nk: the token and expiration date is returning as undefined in mockoon we need to fix it
        if (response.data) {
          this.token = response.data;
          Constants.saveAuthorizationTokenInLocalStorage(
            this.token.accessToken,
            this.token.expirationTime,
          );
          // Constants.saveUserNameInLocalStorage(login.userName);
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
