import { defineStore } from 'pinia';
import { accountSummary } from '../../models/account/accountSummary';
import util from 'src/helpers/util';
import { searchFilter } from 'src/models/account/searchFilter';
import axios from 'axios';

// Define a key for local storage
const SEARCH_HISTORY_LS_KEY = 'accountSearchHistory';

export const useAccountSummaryStore = defineStore('accountSummaryStore', {
  state: () => ({
    accountSummary: [] as accountSummary[],
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
    accounts: (state) => state.accountSummary,
  },

  actions: {
    /**
     * Initializes the store, loading search history from local storage.
     * This should be called once, typically on app startup or when the store is first used.
     */
    init() {
      try {
        const storedHistory = localStorage.getItem(SEARCH_HISTORY_LS_KEY);
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory);
          // Ensure it's an array and limit to maxSearchHistory just in case old data is too large
          if (Array.isArray(parsedHistory)) {
            this.searchHistory = parsedHistory.slice(0, this.maxSearchHistory);
          }
        }
      } catch (e) {
        console.error('Failed to load search history from local storage:', e);
        // Clear corrupted history if parsing fails
        this.searchHistory = [];
        localStorage.removeItem(SEARCH_HISTORY_LS_KEY);
      }
    },

    /**
     * Saves the current search history to local storage.
     * This should be called whenever the searchHistory array is modified.
     */
    saveHistory() {
      try {
        localStorage.setItem(
          SEARCH_HISTORY_LS_KEY,
          JSON.stringify(this.searchHistory),
        );
      } catch (e) {
        console.error('Failed to save search history to local storage:', e);
      }
    },

    buildUrl(): string {
      // we will use this when the prototype is pointed to a real endpoint
      // const baseUrl = `${util.getEndPointUrl()}/account-summary`;
      const baseUrl = 'http://localhost:3000/account-summary';
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
      this.accountSummary = [];
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

      let historyChanged = false; // Flag to track if history actually changed

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
        historyChanged = true;
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
            historyChanged = true;
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
            historyChanged = true;
            // Do not break here, as the new query might also be an extension of another older item
            // Or, more simply, we will add the new query if foundExisting is still false after the loop.
          }
        }

        // If no existing item was an extension or exact match, add the new query
        if (!foundExisting) {
          this.searchHistory.unshift(normalizedNewQuery);
          historyChanged = true;
        }
      }

      // Trim history to max size
      if (this.searchHistory.length > this.maxSearchHistory) {
        this.searchHistory = this.searchHistory.slice(0, this.maxSearchHistory);
        historyChanged = true; // Slicing means history array reference might change
      }
      // Only save if the history array was actually modified
      if (historyChanged) {
        this.saveHistory();
      }
    },

    clearSearchHistory() {
      this.searchHistory = [];
      this.saveHistory(); // Save the cleared history
    },

    removeSearchFromHistory(searchQuery: string) {
      const index = this.searchHistory.indexOf(searchQuery);
      if (index > -1) {
        this.searchHistory.splice(index, 1);
        this.saveHistory(); // Save the modified history
      }
    },

    async fetchAccounts(): Promise<boolean> {
      const urlToFetch = this.nextPageUrl || this.buildUrl();

      try {
        const response = await axios.get(urlToFetch);

        if (response.status === 204) {
          if (this.pageNum === 1) {
            this.accountSummary = [];
            this.errorMsg = 'No accounts found.';
          }
          this.nextPageUrl = null;
          return true;
        }

        if (response.status === 200 && response.data) {
          // Mockoon typically returns the data directly, not nested under a 'data' property
          const data = response.data;

          if (data.length === 0) {
            if (this.pageNum === 1 && this.filter.searchString) {
              this.errorMsg = `No accounts found for "${this.filter.searchString}".`;
            } else if (this.pageNum === 1) {
              this.errorMsg = 'No accounts found.';
            }
            this.nextPageUrl = null;
            return true;
          }

          this.errorMsg = '';

          if (this.pageNum === 1 && this.filter.searchString) {
            this.commitSearchToHistory(this.filter.searchString);
          }

          this.accountSummary.push(...data);

          // Mockoon doesn't send pagination, so we'll handle it simply
          // Assuming we get all data at once
          this.nextPageUrl = null;
          this.pageNum++;

          return true; // Stop infinite scroll
        }
      } catch (error: any) {
        console.error('Failed to fetch accounts:', error);
        if (error.response && error.response.status === 404) {
          this.errorMsg = 'API endpoint not found.';
        } else if (error.message === 'Network Error') {
          this.errorMsg =
            'Network error. Please check your internet connection.';
        } else {
          this.errorMsg = 'An error occurred while fetching accounts.';
        }
        this.nextPageUrl = null;
        return true;
      }

      this.nextPageUrl = null;
      return true;
    },

    $reset() {
      this.accountSummary = [];
      this.pageSize = 15;
      this.pageNum = 1;
      this.nextPageUrl = null;
      this.errorMsg = '';
      this.filter = { searchString: '' };
      // this.searchHistory = []; // Uncomment if you want to clear history on full reset
    },
  },
});

// Call init when the store is first defined/loaded
// This is typically the best place for store-specific initialization logic
const accountSummaryStore = useAccountSummaryStore();
accountSummaryStore.init();
