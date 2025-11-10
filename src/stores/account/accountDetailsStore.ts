import { defineStore } from 'pinia';
import { AccountDetails } from '../../models/account/accountDetails';
import { State, Country, Children } from '../../models/Contact/contactsList';
import { Constants } from '../Constants';
// import { useAccountListsStore } from './AccountListsStore';
import { useContactListsStore } from '../../stores/contact/ContactListsStore';
import util from 'src/helpers/util';

export const useAccountDetailsStore = defineStore('accountDetailsStore', {
  state: () => ({
    accountDetailsList: [] as AccountDetails[],
    states: [] as State[],
    countries: [] as Country[],
    children: [] as Children[],
    accountDetails: {} as AccountDetails,
    account_Id: '' as string,
  }),

  getters: {
    AccountDetailsList: (state) => state.accountDetailsList,
    States: (state) => state.states,
    Countries: (state) => state.countries,
    AccountDetails: (state) => state.accountDetails,
    Children: (state) => state.children,
    AccountId: (state) => state.account_Id,
  },

  actions: {
    async getAccounts() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/account-summary`,
        );
        this.accountDetailsList = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getAccountLists() {
      try {
        // const accountListsStore = useAccountListsStore();
        // await accountListsStore.getAccountList();
        const accountListsStore = useContactListsStore();
        await accountListsStore.getContactList();
        this.states = accountListsStore.States;
        this.countries = accountListsStore.Countries;
        this.children = accountListsStore.Children;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    //   ----getting single user details by id----
    async getAccountDetails(id: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const { data: accountDetails } = await instance.get(
          `${util.getEndPointUrl()}/account-detail/${id}`,
        );

        this.accountDetails = accountDetails;
        return accountDetails;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async editAccountDetails(accountDetails: AccountDetails) {
      const callStr = `${util.getEndPointUrl()}/account-detail/${
        accountDetails.id
      }`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(callStr, accountDetails);
        if (response.status === 200) {
          this.accountDetails = await response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async addAccountDetails(accountDetails: AccountDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${util.getEndPointUrl()}/account-detail`,
          accountDetails,
        );
        if (response.status === 201) {
          this.accountDetails = response.data;
          this.account_Id = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
      this.getAccounts();
    },

    async deleteAccountDetails(id: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${util.getEndPointUrl()}/account-detail/${id}`,
        );
        if (response.status === 200) {
          this.accountDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
