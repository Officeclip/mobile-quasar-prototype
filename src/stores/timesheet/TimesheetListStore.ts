import { defineStore } from 'pinia';
import {
  TimesheetList,
  CustomerProject,
  ServiceItem,
  Period,
  Payroll,
  CustomField,
} from '../../models/Timesheet/timesheetList';
import axios from 'axios';
import { Constants } from '../Constants';

export const useTimesheetListStore = defineStore('timesheetListStore', {
  state: () => ({
    // timesheetList: undefined as TimesheetList | undefined,
    periodList: [] as Period[],
    customerProjectsList: [] as CustomerProject[],
    serviceItemsList: [] as ServiceItem[],
    payrollsList: [] as Payroll[],
    customFieldsList: [] as CustomField[],
    //using to store the selected period from newtimesheetPeriod page
    // selectedPeriod: {} as any,
  }),

  getters: {
    PeriodList: (state) => state.periodList,
    // PeriodList: (state) => state.timesheetList?.periods,
    CustomerProjectsList: (state) => state.customerProjectsList,
    //CustomerProjectsList: (state) => state.timesheetList?.customerProjects,
    ServiceItemsList: (state) => state.serviceItemsList,
    // ServiceItemsList: (state) => state.timesheetList?.serviceItems,
    PayrollsList: (state) => state.payrollsList,
    CustomFieldsList: (state) => state.customFieldsList,

    // SelectedPeriod: (state) => state.selectedPeriod,
  },

  actions: {
    async getTimesheetListAll() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/timesheet-lists`
        );
        const newData = response.data;
        const periods = newData.periods;
        const customerProjects = newData.customerProjects;
        const serviceItems = newData.serviceItems;
        const payrolls = newData.payrolls;
        const customFields = newData.customFields;
        this.periodList = periods;
        this.customerProjectsList = customerProjects;
        this.serviceItemsList = serviceItems;
        this.payrollsList = payrolls;
        this.customFieldsList = customFields;
      } catch (error) {
        console.error(error);
      }
    },

    async getTimesheetsList1() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/timesheet-lists`
        );
        const timesheetList = response.data;
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

    // async getTimesheetListAll() {
    //   await this.getTimesheetsList('CustomerProjects');
    //   await this.getTimesheetsList('ServiceItems');
    //   await this.getTimesheetsList('Periods');
    // },

    getServiceItemsBycustomerProjectId(customerProjectId: string) {
      console.log(
        'getServiceItemsBycustomerProjectId: input:',
        customerProjectId,
        this.ServiceItemsList
      );
      const newItems = this.ServiceItemsList.filter((t) => {
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
