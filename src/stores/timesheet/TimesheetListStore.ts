import { defineStore } from 'pinia';
import {
  CustomerProject,
  ServiceItem,
  Period,
  Payroll,
  CustomField,
} from '../../models/Timesheet/timesheetList';
import { Constants } from '../Constants';
import util from 'src/helpers/util';

export const useTimesheetListStore = defineStore('timesheetListStore', {
  state: () => ({
    periodList: [] as Period[],
    customerProjectsList: [] as CustomerProject[],
    serviceItemsList: [] as ServiceItem[],
    payrollsList: [] as Payroll[],
    customFieldsList: [] as CustomField[],
  }),

  getters: {
    PeriodList: (state) => state.periodList,
    CustomerProjectsList: (state) => state.customerProjectsList,
    ServiceItemsList: (state) => state.serviceItemsList,
    PayrollsList: (state) => state.payrollsList,
    CustomFieldsList: (state) => state.customFieldsList,
  },

  actions: {
    async getTimesheetListAll() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/timesheet-lists`
        );
        const newData = response.data[0];
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
        Constants.throwError(error);
      }
    },

    async getTimesheetsList1() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/timesheet-lists`
        );
        const timesheetList = response.data;
        this.periodList = timesheetList.periods;
        this.customerProjectsList = timesheetList.customerProjects;
        this.serviceItemsList = timesheetList.serviceItems;
      } catch (error) {
        Constants.throwError(error);
      }
    },
    getServiceItemsBycustomerProjectId(customerProjectId: string) {
      const [customerId] = customerProjectId.split(':');
      const newItems = this.ServiceItemsList.filter((t) => {
        return (
          t.customerProjectId === '' ||
          t.customerProjectId === customerProjectId ||
          (customerProjectId.includes(':') &&
            t.customerProjectId === customerId)
        );
      });
      return newItems;
    },
  },
});
