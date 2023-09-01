import { defineStore } from 'pinia';
import { HomeIcon } from '../models/homeIcon';
import axios from 'axios';

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
        const data = await axios.get('http://localhost:4000/orgs');
        this.orgItems = data.data;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async getHomeIcons() {
      try {
        const data = await axios.get('http://localhost:4000/homeIcons');
        this.homeIcons = data.data;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
