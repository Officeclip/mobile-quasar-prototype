import { defineStore } from 'pinia';
import { HomeIcon } from '../models/homeIcon';
import axios from 'axios';
import { Constants } from './Constants';

export const useHomeIconsStore = defineStore('homeIconStore', {
  state: () => ({
    homeIcons: [] as HomeIcon[],
    orgItems: [] as string[], //from: https://stackoverflow.com/a/72151745
  }),

  getters: {
    HomeIcons: (state) => state.homeIcons, // see: https://stackoverflow.com/q/72151708
    OrganizationItems: (state) => state.orgItems,
  },

  actions: {
    async getOrganizationItems() {
      try {
        //console.log(`Endpoint is: ${Constants.endPointUrl}`);
        //const data = await Constants.getAxiosInstance().get('/orgs');
        //const data = await axios.get('/orgs');
        const instance = Constants.getAxiosInstance();
        const data = await instance.get('/orgs');
        // const data = await axios.get(`${Constants.endPointUrl}/orgs`);
        this.orgItems = data.data;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async getHomeIcons() {
      try {
        const instance = Constants.getAxiosInstance();
        const data = await instance.get(`${Constants.endPointUrl}/homeIcons`);
        this.homeIcons = data.data;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
