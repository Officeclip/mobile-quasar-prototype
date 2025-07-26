import { defineStore } from 'pinia';
import { ContactSummary } from '../../models/Contact/contactSummary';
import { Constants } from '../Constants';
import util from 'src/helpers/util';
import { searchFilter } from 'src/models/Contact/searchFilter';
import { useImageDetailStore } from '../ImageDetail';

export const useContactSummaryStore = defineStore('contactSummaryStore', {
  state: () => ({
    contactSummary: [] as ContactSummary[],
    pageSize: 10,
    pageNum: 1,
    // The link for the next page of results from the API. Null if no next page.
    nextPageUrl: null as string | null,
    errorMsg: '' as string,
    filter: {} as searchFilter,
  }),

  getters: {
    // Expose a read-only version of the contacts.
    contacts: (state) => state.contactSummary,
  },

  actions: {
    /**
     * Constructs the base URL for fetching contacts, including filter parameters.
     * @returns {string} The fully constructed URL.
     */
    buildUrl(): string {
      const baseUrl = `${util.getEndPointUrl()}/contact-summary`;
      const params = new URLSearchParams({
        pagenumber: this.pageNum.toString(),
        pagesize: this.pageSize.toString(),
      });

      // Append active filter parameters
      for (const key in this.filter) {
        if (
          Object.prototype.hasOwnProperty.call(this.filter, key) &&
          this.filter[key]
        ) {
          params.append(key, String(this.filter[key]));
        }
      }

      return `${baseUrl}?${params.toString()}`;
    },

    /**
     * Sets a new search filter and resets the store's state for a fresh search.
     * @param {searchFilter} newFilter - The new filter object.
     */
    setFilter(newFilter: searchFilter) {
      this.filter = newFilter;
      this.pageNum = 1;
      this.nextPageUrl = null;
      this.contactSummary = [];
      this.errorMsg = '';
    },

    /**
     * Fetches contacts from the API. Appends to the existing list.
     * @returns {Promise<boolean>} A promise that resolves to true if the end of the list is reached.
     */
    async fetchContacts(): Promise<boolean> {
      // Use the 'nextPageUrl' from the previous API call if it exists, otherwise build a new URL.
      const urlToFetch = this.nextPageUrl || this.buildUrl();

      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(urlToFetch);

        if (response.status === 204) {
          this.contactSummary = [];
          this.errorMsg = 'No contacts found.';
          this.nextPageUrl = null; // No more pages
          return true;
        }

        if (response.status === 200 && response.data?.data) {
          const data = response.data.data;

          if (data.length === 0) {
            if (this.pageNum === 1) this.errorMsg = 'No contacts found.';
            this.nextPageUrl = null; // No more data
            return true;
          }

          this.errorMsg = ''; // Clear previous errors on success

          // ⚠️ NOTE: This loop fetches images one by one to prevent race conditions.
          // For better performance, `useImageDetailStore` should be refactored to cache
          // multiple images by ID, which would allow for parallel fetching.
          const imageDetailStore = useImageDetailStore();
          for (const item of data) {
            if (item.thumbnail) {
              await imageDetailStore.getImageDetail(item.thumbnail);
              const base64Obj = imageDetailStore.ImageDetail;
              if (base64Obj) {
                item.thumbnail = `data:image/${base64Obj.srcType};base64,${base64Obj.src}`;
              }
            }
          }

          this.contactSummary.push(...data);
          this.nextPageUrl = response.data.pagination.next || null;
          this.pageNum++;

          return this.nextPageUrl === null;
        }
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        this.errorMsg = 'An error occurred while fetching contacts.';
        this.nextPageUrl = null; // Stop fetching on error
        return true;
      }

      // Default case if response status is not 200 or 204
      this.nextPageUrl = null;
      return true;
    },
  },
});
