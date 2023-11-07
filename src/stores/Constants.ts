import axios from 'axios';
export class Constants {
  static readonly endPointUrl =
    import.meta.env.VITE_API_ENDPOINT === undefined
      ? 'http://localhost:4000' // using the json-server
      : import.meta.env.VITE_API_ENDPOINT;

  static getAxiosInstance() {
    debugger;
    // const test = import.meta.env.VITE_API_ENDPOINT === undefined ? 1 : 2;
    const instance = axios.create({ baseURL: Constants.endPointUrl });
    instance.defaults.headers.common['X-APIKey'] =
      import.meta.env.VITE_X_APIKey;
    instance.defaults.headers.common['X-OrgKey'] =
      import.meta.env.VITE_X_OrgKey;

    instance.interceptors.request.use((x) => {
      console.log(`axios request: ${JSON.stringify(x)}`);
      return x;
    });
    return instance;
  }
}
