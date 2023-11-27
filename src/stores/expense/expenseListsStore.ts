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
      console.log('expenseListStore.ts > getExpensesList() - started');
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-lists`
        );
        const expenseList = response.data;
        this.periods = expenseList.periods;
        this.customerProjects = expenseList.customerProjects;
        this.expenseTypes = expenseList.expenseTypes;
        this.paymentTypes = expenseList.paymentTypes;
      } catch (error) {
        console.error(error);
      }
      console.log('expenseListStore > getExpensesList() - ended', this.periods);
    },

    getDatesBetweenStartEnd(period: string) {
      const expensePeriod = this.PeriodList.find((x) => x.name === period);
      if (expensePeriod !== undefined) {
        const dates = [];
        let datesList = <Array<{ label: string; value: string }>>[];
        const startDateUnix = new Date(expensePeriod?.start).getTime();
        const endDateUnix = new Date(expensePeriod?.end).getTime();

        // Calculate the difference between the start and end dates in days
        const dayDifference =
          (endDateUnix - startDateUnix) / (1000 * 60 * 60 * 24);

        // Iterate over the days and add them to the array
        for (let i = 0; i <= dayDifference; i++) {
          const date = new Date(startDateUnix + i * 1000 * 60 * 60 * 24);
          dates.push(date);
        }

        const formattedDates = dates.map((date) => {
          return {
            label: `${date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}(${date.toLocaleDateString('en-US', { weekday: 'short' })})`,
            value: date.toISOString(),
          };
        });

        console.log('testing dates', datesList);
        datesList = formattedDates;
        // Return the array of dates
        return datesList;
      }
    },

    /*     async getExpenseListAll() {
      await this.getExpensesList('CustomerProjects');
      await this.getExpensesList('Periods');
    }, */
  },
});
