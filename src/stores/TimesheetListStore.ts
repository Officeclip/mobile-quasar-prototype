import { defineStore } from 'pinia';
import { Timesheet } from '../models/timesheet';
import axios from 'axios';

export const useTimesheetListStore = defineStore('timesheetListStore', {
  state: () => ({
    customerProjectsList: [] as Timesheet[],
    serviceItemsList: [] as Timesheet[],
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
  },
});
