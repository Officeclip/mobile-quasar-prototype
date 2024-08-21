import { defineStore } from 'pinia';
import {
  customerProject,
  period,
  expenseType,
  paymentType,
} from '../../models/expense/expenseLists';
import { Constants } from '../Constants';
import util from 'src/helpers/util';

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
    async getExpensesList() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.endPointUrl()}/expense-lists`
        );
        const expenseList = response.data[0];
        this.periods = expenseList.periods;
        this.customerProjects = expenseList.customerProjects;
        this.expenseTypes = expenseList.expenseTypes;
        this.paymentTypes = expenseList.paymentMethods;
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
