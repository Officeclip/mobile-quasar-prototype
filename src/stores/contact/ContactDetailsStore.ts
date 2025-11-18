import { defineStore } from 'pinia';
import { ContactDetails } from '../../models/Contact/contactDetails';
import { Constants } from '../Constants';
import util from 'src/helpers/util';
import { useImageDetailStore } from '../ImageDetail';

export const useContactDetailsStore = defineStore('contactDetailsStore', {
  state: () => ({
    contactDetailsList: [] as ContactDetails[],
    contactDetails: {} as ContactDetails,
    contact_Id: '' as string,
    selectedTab: '' as string,
  }),

  getters: {
    ContactDetailsList: (state) => state.contactDetailsList,
    ContactDetails: (state) => state.contactDetails,
    ContactId: (state) => state.contact_Id,
    SelectedTab: (state) => state.selectedTab,
  },

  actions: {
    async getContacts() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/contact-summary`,
        );
        this.contactDetailsList = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    //   ----getting single user details by id----
    async getContactDetails(id: string) {
      try {
        const instance = Constants.getAxiosInstance();
        const { data: contactDetails } = await instance.get(
          `${util.getEndPointUrl()}/contact-detail/${id}`,
        );

        if (contactDetails.picture) {
          const imageDetailStore = useImageDetailStore();
          await imageDetailStore.getImageDetail(contactDetails.picture);
          const base64Obj = imageDetailStore.ImageDetail;
          if (base64Obj) {
            contactDetails.picture = `data:image/${base64Obj.srcType};base64,${base64Obj.src}`;
          }
        }
        this.contactDetails = contactDetails;
        return contactDetails;
      } catch (error) {
        Constants.throwError(error);
      }
    },
    async editContactDetails(contactDetails: ContactDetails) {
      const callStr = `${util.getEndPointUrl()}/contact-detail/${
        contactDetails.id
      }`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(callStr, contactDetails);
        if (response.status === 200) {
          this.contactDetails = await response.data;
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
          contactDetails,
        );
        if (response.status === 201) {
          this.contactDetails = response.data;
          this.contact_Id = response.data;
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
          `${util.getEndPointUrl()}/contact-detail/${id}`,
        );
        if (response.status === 200) {
          this.contactDetails = response.data;
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
