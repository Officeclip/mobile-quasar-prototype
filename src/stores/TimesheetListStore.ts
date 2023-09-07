import { defineStore } from 'pinia';
import { CustomerProject } from '../models/Timesheet/customerProject';
import { ServiceItems } from '../models/Timesheet/serviceItems';
import { Period } from '../models/Timesheet/periods';
import axios from 'axios';

export const useTimesheetListStore = defineStore('timesheetListStore', {
  state: () => ({
    customerProjectsList: [] as CustomerProject[],
    serviceItemsList: [] as ServiceItems[],
    periodList: [] as Period[],
  }),

  getters: {
    CustomerProjectsList: (state) => state.customerProjectsList,
    ServiceItemsList: (state) => state.serviceItemsList,
    PeriodList: (state) => state.periodList,
  },

  actions: {
    // getting all the timesheets for testing only, probably no where this use
    // TODO: Get all the list item at one time.
    async getTimesheetsList(name: string) {
      try {
        const response = await axios.get(
          `http://localhost:4000/timesheet-List?name=${name}`
        );
        console.log('Response', response);
        const data = response.data[0].items;
        const newData = Object.keys(data).map((key) => data[key]);

        console.log('New Data', newData);

        if (name == 'CustomerProjects') {
          this.customerProjectsList = newData;
        } else if (name == 'Periods') {
          this.periodList = newData;
        } else {
          this.serviceItemsList = newData;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getTimesheetsList1() {
      try {
        const response = await axios.get(
          'http://localhost:4000/timesheet-List'
        );
        const data = response.data[0].items;
        const newData = Object.keys(data).map((key) => data[key]);
        //const jsonObject = JSON.parse(newData.toString());
        const periods = newData.filter(
          (jsonData) => jsonData.name == 'Periods'
        );
        this.periodList = periods;
        const serviceItems = newData.filter(
          (jsonData) => jsonData.name == 'ServiceItems'
        );
        this.serviceItemsList = serviceItems;
        const customerProjectsList = newData.filter(
          (jsonData) => jsonData.name == 'CustomerProjectsList'
        );
        this.customerProjectsList = customerProjectsList;
      } catch (error) {
        console.error(error);
      }
    },

    async getTimesheetListAll() {
      await this.getTimesheetsList('CustomerProjects');
      await this.getTimesheetsList('ServiceItems');
      await this.getTimesheetsList('Periods');
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
