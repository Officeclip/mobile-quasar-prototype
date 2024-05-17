import axios, { AxiosInstance } from 'axios';
import { LocalStorage, SessionStorage } from 'quasar';
import { responseError } from 'src/models/responseError';
import { Session } from 'src/models/session';

export class Constants {
  static readonly endPointUrl =
    import.meta.env.VITE_API_ENDPOINT === undefined
      ? 'http://localhost:4000' // using the json-server
      : import.meta.env.VITE_API_ENDPOINT;

  static getAxiosInstance() {
    const instance = axios.create({
      //withCredentials: true, //https://stackoverflow.com/a/43178070
      baseURL: Constants.endPointUrl,
    });
    Constants.setupAxiosInstance(instance);
    return instance;
  }

  static setupAxiosInstance(instance: AxiosInstance) {
    instance.defaults.headers.common['X-OrgKey'] = this.getOrgKeyFromSession();
    // import.meta.env.VITE_X_OrgKey;

    this.setupAxiosAuthorizationHeader(instance, 'X-Token'); //add the token if available

    instance.interceptors.request.use((x) => {
      console.log(`axios request: ${JSON.stringify(x)}`);
      console.log('++++++');
      return x;
    });

    instance.interceptors.response.use((x) => {
      console.log(`axios response: ${JSON.stringify(x)}`);
      console.log('++++++');
      return x;
    });
    return instance;
  }

  static setupAxiosAuthorizationHeader(instance: AxiosInstance, token: string) {
    //debugger;
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

  static getOrgKeyFromSession() {
    //debugger;
    if (SessionStorage.has('oc-session')) {
      const session = SessionStorage.getItem('oc-session');
      if (session) {
        return (session as Session).orgKey;
      }
    }
    return '';
  }

  static throwError(error: unknown) {
    //TODO: We need a way to go to the login page if token expires: https://dev.to/darkmavis1980/how-to-use-axios-interceptors-to-handle-api-error-responses-2ij1
    // if (error.response.status === 401) {
    //   window.location.href = '/';
    // }
    console.log(`throwError(...): ${JSON.stringify(error)}`);
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
}
