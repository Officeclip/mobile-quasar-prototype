import { defineStore } from 'pinia';
import {
  airTravelExpense,
  autoRentalExpense,
  hotelExpense,
  mileageExpense,
  taxiExpense,
  telephoneExpense,
  expenseDetails,
  expenseDetailsLite,
} from '../../models/expense/expenseDetails';
import axios from 'axios';
import { Constants } from 'stores/Constants';

export const useExpenseDetailsStore = defineStore('expensesDetailsStore', {
  state: () => ({
    expenseDetailsList: [] as expenseDetails[],
    //expenseDetails: [] as expenseDetails[],
    expenseDetails: undefined as expenseDetails | undefined,
    //expenseDetails: [],
    airTravelExpense: undefined as airTravelExpense | undefined,
    //airTravelExpense: [],
    autoRentalExpense: undefined as autoRentalExpense | undefined,
    //autoRentalExpense: [],
    hotelExpense: undefined as hotelExpense | undefined,
    mileageExpense: undefined as mileageExpense | undefined,
    taxiExpense: undefined as taxiExpense | undefined,
    telephoneExpense: undefined as telephoneExpense | undefined,
    // customerProjectId: '',
    // customerProjectName: '',
    // expenseDetails: [] as ExpenseDetail[],
    // expenseDetail: undefined as ExpenseDetail | undefined,
    // isLoading: false,
  }),

  getters: {
    ExpenseDetailsList: (state) => state.expenseDetailsList,
    ExpenseDetails: (state) => state.expenseDetails,
    AirTravelExpense: (state) => state.airTravelExpense,
    AutoRentalExpense: (state) => state.autoRentalExpense,
    HotelExpense: (state) => state.hotelExpense,
    MileageExpense: (state) => state.mileageExpense,
    TaxiExpense: (state) => state.taxiExpense,
    TelephoneExpense: (state) => state.telephoneExpense,
    //CustomerProjectId: (state) => state.customerProjectId,
    //CustomerProjectName: (state) => state.customerProjectName,
    // IsLoading: (state) => state.isLoading,
  },

  actions: {
    setCustomerProjectId() {
      if (this.expenseDetails) {
        // this.expenseDetails.accountProjectIdName.id =
        const id = `${this.expenseDetails.accountSid}:${this.expenseDetails.projectSid}`;
        // this.expenseDetails.accountProjectIdName.name =
        const name = `${this.expenseDetails.accountName}:${this.expenseDetails.projectName}`;
        this.expenseDetails.accountProjectIdName = { id: id, name: name };
      }
    },

    getCustomerProjectValue() {
      if (this.expenseDetails) {
        const splitIdValues =
          this.expenseDetails.accountProjectIdName.id.split(':');
        this.expenseDetails.accountSid = splitIdValues[0];
        this.expenseDetails.projectSid = splitIdValues[1];
        const splitNameValues =
          this.expenseDetails.accountProjectIdName.name.split(':');
        this.expenseDetails.accountName = splitNameValues[0];
        this.expenseDetails.projectName = splitNameValues[1];
      }
    },

    async getExpenseDetails(expenseSid: string | string[]) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-details?expenseSid=${expenseSid}`
        );
        console.log('Getting Id', expenseSid);
        this.expenseDetailsList = response.data;
        this.setCustomerProjectId();
        console.log(this.expenseDetailsList);
      } catch (error) {
        console.error(error);
      }
    },

    async getExpenseDetailById(id: string | string[]) {
      // this.isLoading = true;
      console.log(
        'expenseDetailsStore.ts > getExpenseDetailById - started: ',
        id
      );
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/expense-details?id=${id}`
        );
        //console.log(`response.data[0]: ${response.data}`);
        if (response.data && response.data.length > 0) {
          //this.expenseDetails = JSON.parse(JSON.stringify(response.data[0])); // see: https://stackoverflow.com/a/69204006/89256
          this.expenseDetails = response.data[0]; // see: https://stackoverflow.com/a/69204006/89256
          this.setCustomerProjectId();
          console.log(
            `expenseDetailStore - getExpenseDetailById - expenseDetails: ${this.expenseDetails}`
          );
        }
      } catch (error) {
        alert(error);
        console.log(error);
      } finally {
        // this.isLoading = false;
      }
      console.log('expenseDetailsStore.ts> getExpenseDetailById - ended');
    },

    convertExpenseDetailsToLite(
      expenseDetails: expenseDetails
    ): expenseDetailsLite {
      //const lite: expenseDetailsLite = new expenseDetailsLite();
      //const lite = {} as expenseDetailsLite; //https://stackoverflow.com/a/13142840
      const lite = <expenseDetailsLite>{}; //https://stackoverflow.com/a/24250926

      Object.keys(expenseDetails).forEach((key) => {
        // https://stackoverflow.com/a/77134454
        if (lite.hasOwnProperty(key))
          lite[key as keyof expenseDetailsLite] = expenseDetails[
            key as keyof expenseDetails
          ] as never;
      });

      // for (const k in expenseDetails) {
      //   if (k !== 'accountProjectIdName') {
      //     lite[k] = expenseDetails[k];
      //   }
      // }
      return lite;
    },

    async addExpense(expenseDetails: expenseDetails) {
      try {
        this.getCustomerProjectValue();
        const lite = this.convertExpenseDetailsToLite(expenseDetails);
        const response = await axios.post(
          `${Constants.endPointUrl}/expense-details`,
          lite
        );
        if (response.status === 200) {
          this.expenseDetails = response.data;
        }
      } catch (error) {
        console.error(`editExpense Error: ${error}`);
      }
    },

    async editExpense(expenseDetails: expenseDetails) {
      try {
        this.getCustomerProjectValue();
        const response = await axios.put(
          `${Constants.endPointUrl}/expense-details/${expenseDetails.id}`,
          expenseDetails
        );
        if (response.status === 200) {
          this.expenseDetails = response.data;
        }
      } catch (error) {
        console.error(`editExpense Error: ${error}`);
      }
    },

    async deleteExpense(id: string | undefined) {
      try {
        const response = await axios.delete(
          `${Constants.endPointUrl}/expense-details/${id}`
        );
        if (response.status === 200) {
          this.expenseDetails = response.data;
        }
      } catch (error) {
        console.error(`deleteExpense Error: ${error}`);
      }
    },
  },
});
