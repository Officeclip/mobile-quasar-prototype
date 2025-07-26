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
    nextPageUrl: null as string | null,
    errorMsg: '' as string,
    filter: {
      searchString: '',
    } as searchFilter,
    searchHistory: [] as string[],
    maxSearchHistory: 5,
  }),

  getters: {
    contacts: (state) => state.contactSummary,
  },

  actions: {
    buildUrl(): string {
      const baseUrl = `${util.getEndPointUrl()}/contact-summary`;
      const params = new URLSearchParams({
        pagenumber: this.pageNum.toString(),
        pagesize: this.pageSize.toString(),
      });

      for (const key in this.filter) {
        if (
          Object.prototype.hasOwnProperty.call(this.filter, key) &&
          (this.filter as any)[key]
        ) {
          params.append(key, String((this.filter as any)[key]));
        }
      }

      return `${baseUrl}?${params.toString()}`;
    },

    setFilter(newFilter: searchFilter) {
      this.filter = { ...this.filter, ...newFilter };
      this.pageNum = 1;
      this.nextPageUrl = null;
      this.contactSummary = [];
      this.errorMsg = '';
    },

    /**
     * Commits a search query to the history. This should be called only for final, successful searches.
     * This version intelligently handles extensions of existing history items.
     * @param {string} searchQuery - The search string to add.
     */
    commitSearchToHistory(searchQuery: string) {
      if (!searchQuery || typeof searchQuery !== 'string') return;

      const normalizedNewQuery = searchQuery.trim().toLowerCase();
      if (!normalizedNewQuery) return; // Don't add empty strings or only whitespace to history

      let foundExisting = false;
      let existingIndex = -1;

      // Check if an exact duplicate (case-insensitive) already exists
      existingIndex = this.searchHistory.findIndex(
        (item: string) => item.toLowerCase() === normalizedNewQuery,
      );
      if (existingIndex > -1) {
        // If it's already the most recent item, do nothing
        if (existingIndex === 0) return;
        // Otherwise, remove it from its current position to move it to the front
        this.searchHistory.splice(existingIndex, 1);
        this.searchHistory.unshift(normalizedNewQuery);
        foundExisting = true;
      } else {
        // If not an exact duplicate, check for extensions
        for (let i = 0; i < this.searchHistory.length; i++) {
          const normalizedExistingItem = this.searchHistory[i].toLowerCase();

          // Case: New query is an extension of an existing history item
          // e.g., existing "dan", new "danny"
          if (
            normalizedNewQuery.startsWith(normalizedExistingItem) &&
            normalizedNewQuery.length > normalizedExistingItem.length
          ) {
            this.searchHistory.splice(i, 1); // Remove the shorter, older version
            this.searchHistory.unshift(normalizedNewQuery); // Add the longer, new version to the front
            foundExisting = true;
            break; // We've updated, no need to check further
          }
          // Case: Existing history item is an extension of the new query
          // e.g., existing "danny", new "dan"
          // In this scenario, we keep the longer "danny" UNLESS the user explicitly searches for "dan" later.
          // If user searches "Danny", then later searches "Dan", "Danny" should be replaced by "Dan"
          else if (
            normalizedExistingItem.startsWith(normalizedNewQuery) &&
            normalizedExistingItem.length > normalizedNewQuery.length
          ) {
            // This means the user typed a shorter version of something previously searched.
            // We should remove the longer one and add the new, shorter one to the front.
            this.searchHistory.splice(i, 1); // Remove the longer existing item
            // Do not break here, as the new query might also be an extension of another older item
            // Or, more simply, we will add the new query if foundExisting is still false after the loop.
          }
        }

        // If no existing item was an extension or exact match, add the new query
        if (!foundExisting) {
          this.searchHistory.unshift(normalizedNewQuery);
        }
      }

      // Trim history to max size
      if (this.searchHistory.length > this.maxSearchHistory) {
        this.searchHistory = this.searchHistory.slice(0, this.maxSearchHistory);
      }
    },

    clearSearchHistory() {
      this.searchHistory = [];
    },

    removeSearchFromHistory(searchQuery: string) {
      const index = this.searchHistory.indexOf(searchQuery);
      if (index > -1) {
        this.searchHistory.splice(index, 1);
      }
    },

    async fetchContacts(): Promise<boolean> {
      const urlToFetch = this.nextPageUrl || this.buildUrl();

      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(urlToFetch);

        if (response.status === 204) {
          if (this.pageNum === 1) {
            this.contactSummary = [];
            this.errorMsg = 'No contacts found.';
          }
          this.nextPageUrl = null;
          return true;
        }

        if (response.status === 200 && response.data?.data) {
          const data = response.data.data;

          if (data.length === 0) {
            if (this.pageNum === 1 && this.filter.searchString) {
              this.errorMsg = `No contacts found for "${this.filter.searchString}".`;
            } else if (this.pageNum === 1) {
              this.errorMsg = 'No contacts found.';
            }
            this.nextPageUrl = null;
            return true;
          }

          this.errorMsg = '';

          // ONLY COMMIT TO HISTORY HERE if it's the first page of a new search
          // and the searchString is not empty.
          if (this.pageNum === 1 && this.filter.searchString) {
            this.commitSearchToHistory(this.filter.searchString);
          }

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
      } catch (error: any) {
        console.error('Failed to fetch contacts:', error);
        if (error.response && error.response.status === 404) {
          this.errorMsg = 'API endpoint not found.';
        } else if (error.message === 'Network Error') {
          this.errorMsg =
            'Network error. Please check your internet connection.';
        } else {
          this.errorMsg = 'An error occurred while fetching contacts.';
        }
        this.nextPageUrl = null;
        return true;
      }

      this.nextPageUrl = null;
      return true;
    },

    $reset() {
      this.contactSummary = [];
      this.pageSize = 10;
      this.pageNum = 1;
      this.nextPageUrl = null;
      this.errorMsg = '';
      this.filter = { searchString: '' };
      // this.searchHistory = []; // Uncomment if you want to clear history on full reset
    },
  },
});
