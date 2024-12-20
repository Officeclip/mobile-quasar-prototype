import { defineStore } from 'pinia';
import { ContactDetails } from '../../models/Contact/contactDetails';
import { State, Country, Children } from '../../models/Contact/contactsList';
import { Constants } from '../Constants';
import { useContactListsStore } from './ContactListsStore';
import util from 'src/helpers/util';

export const useContactDetailsStore = defineStore('contactDetailsStore', {
  state: () => ({
    contactDetailsList: [] as ContactDetails[],
    states: [] as State[],
    countries: [] as Country[],
    children: [] as Children[],
    contactDetails: undefined as ContactDetails | undefined, // we kept it separate because we will make a
  }),

  getters: {
    ContactDetailsList: (state) => state.contactDetailsList,
    States: (state) => state.states,
    Countries: (state) => state.countries,
    ContactDetails: (state) => state.contactDetails,
    Children: (state) => state.children,
  },

  actions: {
    async getContacts() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/contact-summary`
        );
        this.contactDetailsList = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getContactLists() {
      try {
        const contactListsStore = useContactListsStore();
        await contactListsStore.getContactList();
        this.states = contactListsStore.States;
        this.countries = contactListsStore.Countries;
        this.children = contactListsStore.Children;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    //   ----getting single user details by id----
    async getContactDetails(id: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/contact-detail/${id}`
        );
        if (response.data) {
          this.contactDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getContactsByBatch(limit: number, page: number) {
      const callStr = `${util.getEndPointUrl()}/contact-summary?_limit=${limit}&_page=${page}`;
      const res = await fetch(callStr);
      const data = await res.json();
      this.contactDetailsList.push(...data);
    },

    async getContactsWithFilter(limit: number, page: number, filter: string) {
      const callStr = `${util.getEndPointUrl()}/contact-summary?_limit=${limit}&_page=${page}&first_name_like=${filter}`;
      const res = await fetch(callStr);
      const data = await res.json();
      this.contactDetailsList.push(...data);
    },

    async editContactDetails(contactDetails: ContactDetails) {
      const callStr = `${util.getEndPointUrl()}/contact-detail/${
        contactDetails.id
      }`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(callStr, contactDetails);
        if (response.status === 200) {
          this.contactDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async addContactDetails(contactDetails: ContactDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${util.getEndPointUrl()}/contact-detail`,
          contactDetails
        );
        if (response.status === 201) {
          this.contactDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
      this.getContacts();
    },

    async deleteContactDetails(id: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${util.getEndPointUrl()}/contact-detail/${id}`
        );
        if (response.status === 200) {
          this.contactDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
