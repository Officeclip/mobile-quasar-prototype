import { defineStore } from 'pinia';
import axios from 'axios';
import { Constants } from 'stores/Constants';

export const useTestDuttaStore = defineStore('testDuttaStore', {
  state: () => ({
    testDutta: null, // for single event access
  }),
  getters: {
    TestDutta: (state) => state.testDutta,
  },
  actions: {
    async getDuttaTest() {
      try {
        const instance = axios.create({
          baseURL: 'http://localhost/officeclip/api',
          //withCredentials: true, //https://stackoverflow.com/a/43178070
        });
        Constants.setupAxiosInstance(instance);
        //debugger;
        Constants.setupAxiosAuthorizationHeader(instance, 'X-Token');
        const response = await instance.get('/test/');
        this.testDutta = response.data[0];
        //debugger;
        const tokenHeader = response.headers['X-Token'];
        if (tokenHeader) {
          Constants.saveAuthorizationTokenInLocalStorage(tokenHeader);
        }
        console.log(
          `TestDuttaStore: getDuttaTestById - length - ${response.headers}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
