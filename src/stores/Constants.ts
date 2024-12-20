import axios, { AxiosInstance } from 'axios';
import { LocalStorage, SessionStorage } from 'quasar';
import logger from 'src/helpers/logger';
import util from 'src/helpers/util';
import { responseError } from 'src/models/responseError';
import { Session } from 'src/models/session';

export class Constants {
  static readonly defaultLogin = LocalStorage.has('userName')
    ? String(LocalStorage.getItem('userName'))
    : '';

  static getAxiosInstance() {
    const instance = axios.create({
      baseURL: util.getEndPointUrl(),
    });
    Constants.setupAxiosInstance(instance);
    return instance;
  }

  static setupAxiosInstance(instance: AxiosInstance) {
    instance.defaults.headers.common['X-OrgKey'] = this.getOrgKeyFromSession();
    instance.defaults.headers.common['Cache-Control'] = 'no-cache';
    instance.defaults.headers.common['Pragma'] = 'no-cache';
    instance.defaults.headers.common['Expires'] = '0';

    this.setupAxiosAuthorizationHeader(instance, 'X-Token'); //add the token if available

    instance.interceptors.request.use((x) => {
      logger.log(`axios request: ${JSON.stringify(util.decycle(x), null, 4)}`);
      logger.log('++++++');
      return x;
    });

    instance.interceptors.response.use(
      (x) => {
        logger.log(
          `axios response: ${JSON.stringify(util.decycle(x), null, 4)}`
        );
        logger.log('++++++');
        return x;
      },
      (error) => {
        // Handle errors globally
        console.error('axios response error::', error);
        // Optionally, we can perform specific actions based on the error status
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          logger.log('error.response triggred');
          console.error('Response Status:', error.response.status);
          console.error('Response Data:', error.response.data);
        } else if (error.request) {
          logger.log('error.request triggred');
          // The request was made but no response was received
          console.error('No response received. Request:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Request Error:', error.message);
        }
        logger.log('++++++');
        // We can choose to rethrow the error or handle it as needed
        return Promise.reject(error);
      }
    );
    return instance;
  }

  static setupAxiosAuthorizationHeader(instance: AxiosInstance, token: string) {
    let tokenValue = '';
    if (LocalStorage.has(token)) {
      tokenValue = String(LocalStorage.getItem(token)).split(',', 2)[0];
    }
    instance.defaults.headers.common[token] = tokenValue;
  }

  static saveAuthorizationTokenInLocalStorage(
    token: string,
    expirationUnixEpoch: number
  ) {
    LocalStorage.set('X-Token', `${token},${expirationUnixEpoch}`);
  }

  static saveUserNameInLocalStorage(userName: string | null) {
    if (userName) {
      LocalStorage.set('userName', userName);
    }
  }

  static saveEndPointUrlInLocalStorage(endPointUrl: string | null) {
    if (endPointUrl) {
      LocalStorage.set('endPointUrl', endPointUrl);
    }
  }

  static getOrgKeyFromSession() {
    if (SessionStorage.has('oc-session')) {
      const session = SessionStorage.getItem('oc-session');
      if (session) {
        return (session as Session).orgKey;
      }
    }
    return '';
  }

  static getRestApiVersionFromSession() {
    if (SessionStorage.has('oc-session')) {
      const session = SessionStorage.getItem('oc-session');
      if (session) {
        return (session as Session).restApiVersion;
      }
    }
    return '';
  }

  static throwError(error: unknown) {
    //TODO: We need a way to go to the login page if token expires: https://dev.to/darkmavis1980/how-to-use-axios-interceptors-to-handle-api-error-responses-2ij1
    logger.log(
      `throwError(...): ${JSON.stringify(util.decycle(error), null, 4)}`
    );
    if (axios.isAxiosError(error)) {
      if (error?.response?.data) {
        const responseError: responseError = error.response.data;
        Constants.throwError(
          `${responseError.description}: ${responseError.message}`
        );
      } else {
        throw `Axios error: ${error.message}`;
      }
    }
    throw 'Error: ' + (error as string);
  }

  static getLocalStorageEndPointUrl() {
    if (LocalStorage.has('endPointUrl')) {
      return String(LocalStorage.getItem('endPointUrl'));
    }
    return '';
    // return 'https://app.officeclip.com/api';
  }
}
