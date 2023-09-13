import { defineStore } from 'pinia';
import { CustomerProject, Period } from '../models/Expense/expenseList';
import axios from 'axios';
import { Constants } from './Constants';

export const useExpenseListStore = defineStore('expenseListStore', {
  state: () => ({
    customerProjectsList: [] as CustomerProject[],
    periodList: [] as Period[],
  }),

  getters: {
    CustomerProjectsList: (state) => state.customerProjectsList,
    PeriodList: (state) => state.periodList,
  },

  actions: {
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
          this.customerProjectsList = newData;
        } else {
          this.periodList = newData;
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getExpensesList1() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-list`
        );
        const expenseList = response.data[0];
        this.periodList = expenseList.periods;
        this.customerProjectsList = expenseList.customerProjects;
      } catch (error) {
        console.error(error);
      }
    },

    async getExpenseListAll() {
      await this.getExpensesList('CustomerProjects');
      await this.getExpensesList('Periods');
    },
  },
});
