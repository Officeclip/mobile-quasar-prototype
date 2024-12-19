import { defineStore } from 'pinia';
import { Token } from '../models/token';
import { Login } from '../models/login';
import { Constants } from './Constants';
import util from 'src/helpers/util';

export const useTokenStore = defineStore('loginStore', {
  // ... (state and getters remain unchanged) ...

  actions: {
    async validateLogin(loginData: Login, mpin: string) {
      try {
        const loginPayload = prepareLoginPayload(loginData, mpin);
        const response = await sendLoginRequest(loginPayload);
        await handleLoginResponse(response, loginData, this); // Pass 'this'
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});

const prepareLoginPayload = (loginData: Login, mpin: string): Login => {
  const loginPayload = { ...loginData };
  loginPayload.mpin = mpin.length > 0 ? mpin : null;
  loginPayload.userName = loginPayload.mpin ? null : loginData.userName;
  loginPayload.password = loginPayload.mpin ? null : loginData.password;
  return loginPayload;
};

const sendLoginRequest = async (loginPayload: Login): Promise<any> => {
  const instance = Constants.getAxiosInstance();
  const response = await instance.post(
    `${util.endPointUrl()}/login`,
    loginPayload
  );
  return response;
};

const handleLoginResponse = async (
  response: any,
  loginData: Login,
  store: any
): Promise<void> => {
  // Add store parameter
  if (response?.data) {
    const tokenData = response.data as Token;
    if (tokenData.accessToken && tokenData.expirationTime) {
      store.token = tokenData; // Access 'token' using store
      Constants.saveAuthorizationTokenInLocalStorage(
        store.token.accessToken,
        store.token.expirationTime
      );
      Constants.saveUserNameInLocalStorage(loginData.userName);
    } else {
      console.error(
        'Invalid token data received from the server:',
        response.data
      );
      // Handle invalid token data appropriately
    }
  } else {
    console.error('No data received from the server:', response);
    // Handle no data case
  }
};
