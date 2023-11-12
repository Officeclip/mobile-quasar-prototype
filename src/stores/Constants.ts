import axios, { AxiosInstance } from 'axios';
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
  }

  static setupAxiosInstance(instance: AxiosInstance) {
    instance.defaults.headers.common['X-APIKey'] =
      import.meta.env.VITE_X_APIKey;
    instance.defaults.headers.common['X-OrgKey'] =
      import.meta.env.VITE_X_OrgKey;

    instance.interceptors.request.use((x) => {
      console.log(`axios request: ${JSON.stringify(x)}`);
      return x;
    });
    instance.interceptors.response.use((x) => {
      console.log(`axios response: ${JSON.stringify(x)}`);
      return x;
    });
    return instance;
  }
}
