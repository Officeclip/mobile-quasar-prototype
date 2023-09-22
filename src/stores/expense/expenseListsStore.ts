import { defineStore } from 'pinia';
import {
  customerProject,
  period,
  expenseType,
  paymentType,
} from '../../models/expense/expenseLists';
import axios from 'axios';
import { Constants } from '../Constants';

export const useExpenseListsStore = defineStore('expenseListsStore', {
  state: () => ({
    customerProjects: [] as customerProject[],
    periods: [] as period[],
    expenseTypes: [] as expenseType[],
    paymentTypes: [] as paymentType[],
  }),

  getters: {
    CustomerProjectsList: (state) => state.customerProjects,
    PeriodList: (state) => state.periods,
    ExpenseTypes: (state) => state.expenseTypes,
    PaymentTypes: (state) => state.paymentTypes,
  },

  actions: {
    /*     async getEventLists() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-lists`
        );
        const expenseLists = response.data[0];
        this.customerProjects = expenseLists.customerProjects;
        this.periods = expenseLists.periods;
        this.expenseTypes = expenseLists.expenseTypes;
      } catch (error) {
        console.error(error);
      }
    },

    // getting all the timesheets for testing only, probably no where this use
    // TODO: Get all the list item at one time.
    async getExpensesList(name: string) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}expense-list?name=${name}`
        );
        console.log('Response', response);
        const data = response.data[0].items;
        const newData = Object.keys(data).map((key) => data[key]);

        console.log('New Data', newData);

        if (name == 'CustomerProjects') {
          this.customerProjects = newData;
        } else {
          this.periods = newData;
        }
      } catch (error) {
        console.error(error);
      }
    }, */

    async getExpensesList() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-lists`
        );
        const expenseList = response.data[0];
        this.periods = expenseList.periods;
        this.customerProjects = expenseList.customerProjects;
        this.expenseTypes = expenseList.expenseTypes;
        this.paymentTypes = expenseList.paymentTypes;
      } catch (error) {
        console.error(error);
      }
    },

    /*     async getExpenseListAll() {
      await this.getExpensesList('CustomerProjects');
      await this.getExpensesList('Periods');
    }, */
  },
});
