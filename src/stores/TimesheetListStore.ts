import { defineStore } from 'pinia';
import { CustomerProject } from '../models/Timesheet/customerProject';
import { ServiceItems } from '../models/Timesheet/serviceItems';
import axios from 'axios';

export const useTimesheetListStore = defineStore('timesheetListStore', {
  state: () => ({
    customerProjectsList: [] as CustomerProject[],
    serviceItemsList: [] as ServiceItems[],
  }),

  getters: {
    CustomerProjectsList: (state) => state.customerProjectsList,
    ServiceItemsList: (state) => state.serviceItemsList,
  },

  actions: {
    // getting all the timesheets for testing only, probably no where this use

    async getTimesheetsList(name: string) {
      try {
        const response = await axios.get(
          `http://localhost:4000/timesheet-List?name=${name}`
        );
        const data = response.data[0].items;
        const newData = Object.keys(data).map((key) => data[key]);

        console.log('xxxxxxxx', newData);

        if (name == 'CustomerProjects') {
          this.customerProjectsList = newData;
        } else {
          this.serviceItemsList = newData;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getTimesheetListAll() {
      await this.getTimesheetsList('CustomerProjects');
      await this.getTimesheetsList('ServiceItems');
    },

    getServiceItemsBycustomerProjectId(customerProjectId: string) {
      console.log('customerProject Id: ', customerProjectId);
      const newItems: ServiceItems[] = this.serviceItemsList.filter((t) => {
        return (
          t.customerProjectId === '' ||
          t.customerProjectId === customerProjectId
        );
      });
      return newItems;
    },
  },
});
