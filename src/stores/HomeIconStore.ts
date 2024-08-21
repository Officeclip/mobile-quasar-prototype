import { defineStore } from 'pinia';
import { HomeIcon } from '../models/homeIcon';
import { Constants } from './Constants';
import logger from 'src/helpers/logger';
import util from 'src/helpers/util';

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
        const instance = Constants.getAxiosInstance();
        const data = await instance.get('/orgs');
        this.orgItems = data.data;
      } catch (error: any) {
        alert(error);
        logger.log(error);
      }
    },
    async getHomeIcons() {
      try {
        const instance = Constants.getAxiosInstance();
        const data = await instance.get(`${util.endPointUrl()}/homeIcons`);
        this.homeIcons = data.data;
      } catch (error: any) {
        alert(error);
        logger.log(error);
      }
    },
  },
});
