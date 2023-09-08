import { defineStore } from 'pinia';
/* import { CustomerProject } from '../models/Timesheet/customerProject';
import { ServiceItems } from '../models/Timesheet/serviceItems';
import { Period } from '../models/Timesheet/periods'; */
import {
  TimesheetList,
  CustomerProject,
  ServiceItem,
  Period,
} from '../models/Timesheet/timesheetList';
import axios from 'axios';
import { Constants } from './Constants';

export const useTimesheetListStore = defineStore('timesheetListStore', {
  state: () => ({
    // timesheetList: undefined as TimesheetList | undefined,
    customerProjectsList: [] as CustomerProject[],
    serviceItemsList: [] as ServiceItem[],
    periodList: [] as Period[],
  }),

  getters: {
    CustomerProjectsList: (state) => state.customerProjectsList,
    //CustomerProjectsList: (state) => state.timesheetList?.customerProjects,
    ServiceItemsList: (state) => state.serviceItemsList,
    // ServiceItemsList: (state) => state.timesheetList?.serviceItems,
    PeriodList: (state) => state.periodList,
    // PeriodList: (state) => state.timesheetList?.periods,
  },

  actions: {
    // getting all the timesheets for testing only, probably no where this use
    // TODO: Get all the list item at one time.
    async getTimesheetsList(name: string) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}timesheet-List?name=${name}`
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
          `${Constants.endPointUrl}/timesheet-List`
        );
        const timesheetList = response.data[0];
        //this.timesheetList = timesheetList;
        //debugger;
        this.periodList = timesheetList.periods;
        this.customerProjectsList = timesheetList.customerProjects;
        this.serviceItemsList = timesheetList.serviceItems;
        /*       console.log(
          `getTimesheetsList1: customerProjectsList: ${this.customerProjectsList[0].name}`
        ); */
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
      console.log(
        'getServiceItemsBycustomerProjectId: input:',
        customerProjectId,
        this.ServiceItemsList
      );
      const newItems: ServiceItem[] = this.serviceItemsList.filter((t) => {
        return (
          t.customerProjectId === '' ||
          t.customerProjectId === customerProjectId
        );
      });
      console.log('getServiceItemsBycustomerProjectId: output:', newItems);
      return newItems;
    },
  },
});
