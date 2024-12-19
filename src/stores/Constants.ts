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
      baseURL: util.endPointUrl(),
    });
    this.setupAxiosInstance(instance);
    return instance;
  }

  static setupAxiosInstance(instance: AxiosInstance) {
    this.setCommonHeaders(instance);
    this.setupAxiosAuthorizationHeader(instance, 'X-Token');
    this.setupInterceptors(instance);
    return instance;
  }

  static setCommonHeaders(instance: AxiosInstance) {
    instance.defaults.headers.common['X-OrgKey'] = this.getOrgKeyFromSession();
    instance.defaults.headers.common['Cache-Control'] = 'no-cache';
    instance.defaults.headers.common['Pragma'] = 'no-cache';
    instance.defaults.headers.common['Expires'] = '0';
  }

  static setupInterceptors(instance: AxiosInstance) {
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
      (error) => this.handleResponseError(error)
    );
  }

  static handleResponseError(error: any) {
    console.error('axios response error::', error);
    if (error.response) {
      logger.log('error.response triggered');
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    } else if (error.request) {
      logger.log('error.request triggered');
      console.error('No response received. Request:', error.request);
    } else {
      console.error('Request Error:', error.message);
    }
    logger.log('++++++');
    return Promise.reject(error);
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
  }
}
