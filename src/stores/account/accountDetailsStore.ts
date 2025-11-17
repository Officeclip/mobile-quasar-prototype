import { defineStore } from 'pinia';
import { AccountDetails } from '../../models/account/accountDetails';
import { Constants } from '../Constants';
import util from 'src/helpers/util';

export const useAccountDetailsStore = defineStore('accountDetailsStore', {
  state: () => ({
    accountDetailsList: [] as AccountDetails[],
    accountDetails: {} as AccountDetails,
    account_Id: '' as string,
    selectedTab: '' as string,
  }),

  getters: {
    AccountDetailsList: (state) => state.accountDetailsList,
    AccountDetails: (state) => state.accountDetails,
    AccountId: (state) => state.account_Id,
    SelectedTab: (state) => state.selectedTab,
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

    async updateAccount(accountDetails: AccountDetails) {
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

    async addAccount(accountDetails: AccountDetails) {
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

    async deleteAccount(id: string) {
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

    setSelectedTab(tab: string) {
      this.selectedTab = tab;
    },
  },
});
