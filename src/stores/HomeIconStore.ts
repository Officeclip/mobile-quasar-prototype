import { defineStore } from 'pinia';
import { HomeIcon } from '../models/homeIcon';
import axios from 'axios';

export const useHomeIconsStore = defineStore('homeIconStore', {
  state: () => ({
    homeIcons: [] as HomeIcon[],
    organizationItems: [] as string[], //from: https://stackoverflow.com/a/72151745
  }),

  getters: {
    HomeIcons: (state) => state.homeIcons, // see: https://stackoverflow.com/q/72151708
    OrganizationItems: (state) => state.organizationItems,
  },

  actions: {
    getOrganizationItems() {
      this.organizationItems = [
        'OfficeClip Work',
        'Development',
        'Testing',
        'Nagesh Work',
        'Nagesh Testing',
      ];
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
