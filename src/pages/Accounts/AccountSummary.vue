<script setup lang="ts">
import { ref, onMounted, Ref, nextTick, watch } from 'vue';
import { useAccountSummaryStore } from 'src/stores/account/accountSummaryStore';
import { storeToRefs } from 'pinia';
import OC_Drawer from 'src/components/OC_Drawer.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import { onBeforeRouteLeave } from 'vue-router';
import { useQuasar } from 'quasar';

// --- Store and Router Initialization ---

const accountSummaryStore = useAccountSummaryStore();
const { accounts, errorMsg, searchHistory } = storeToRefs(accountSummaryStore);
const $q = useQuasar();

// --- Component State ---
const loading = ref(false);
const searchString: Ref<string> = ref('');
const reachedEnd = ref(false);
const myDrawer = ref();

const infiniteScrollRef = ref(null);

// const searchHistory = computed(() => contactSummaryStore.searchHistory);

// const onSearch = async (value: string | null | number) => {
//   accountSummaryStore.setFilter({ searchString: value as string });
//   await accountSummaryStore.fetchAccounts();
// };

const refresh = async (done: () => void) => {
  accountSummaryStore.$reset();
  await accountSummaryStore.fetchAccounts();
  done();
};

// const onLoad = async (index: number, done: (stop: boolean) => void) => {
//   const stop = await accountSummaryStore.fetchAccounts();
//   done(stop);
// };

// onMounted(async () => {
//   accountSummaryStore.$reset();
//   await accountSummaryStore.fetchAccounts();
// });

// ///////////////////////////////////////
const loadMore = async (index: number, done: () => void) => {
  // Prevent loading if we are already loading or if the current pageNum is 1 (initial load handled elsewhere)
  if (loading.value || accountSummaryStore.pageNum === 1) {
    done();
    return;
  }

  // Ensure there's actually a next page to fetch based on store's nextPageUrl
  if (
    accountSummaryStore.nextPageUrl === null &&
    accountSummaryStore.accounts.length > 0
  ) {
    done(); // Signal end if no next page exists
    return;
  }

  loading.value = true;
  try {
    console.log(
      `Infinite scroll triggered: Fetching page ${accountSummaryStore.pageNum}`,
    );
    reachedEnd.value = await accountSummaryStore.fetchAccounts();
  } catch (error) {
    $q.dialog({
      title: 'Error',
      message: 'An unexpected error occurred during data load.' + error.message,
    });
    reachedEnd.value = true;
  } finally {
    loading.value = false;
    done(); // Signal Quasar Infinite Scroll that loading is complete
  }
};

const applySearchFilter = async () => {
  // Always set loading true at the start of any new search
  loading.value = true;
  reachedEnd.value = false; // Reset reachedEnd for a new search

  // 1. Set the filter in the store (this resets pageNum to 1 and clears contactSummary)
  accountSummaryStore.setFilter({
    searchString: searchString.value.toLowerCase(),
  });

  // Handle the "type 3 characters" message
  if (searchString.value.length > 0 && searchString.value.length < 3) {
    accountSummaryStore.errorMsg = 'Type at least 3 characters to search.';
    loading.value = false; // Hide loader if no fetch
    return; // Stop here, don't fetch
  }

  // 2. Explicitly fetch the first page of results for the new filter
  try {
    console.log(
      `Applying search filter: Fetching initial page for "${searchString.value}"`,
    );
    reachedEnd.value = await accountSummaryStore.fetchAccounts();
  } catch (error) {
    console.error('Error applying search filter:', error);
    $q.dialog({ title: 'Error', message: 'Failed to perform search.' });
    reachedEnd.value = true;
  } finally {
    loading.value = false;
    // Reset infinite scroll:
    // This is crucial. After a new search, tell the infinite scroll to reset its state
    // so it properly triggers for subsequent pages if needed.
    // Use nextTick to ensure the DOM has updated after contacts are cleared.
    await nextTick();
    if (
      infiniteScrollRef.value &&
      typeof (infiniteScrollRef.value as any).reset === 'function'
    ) {
      (infiniteScrollRef.value as any).reset();
    }
    // Also, trigger a load if the initial fetch didn't fill the screen (or if no results)
    if (
      infiniteScrollRef.value &&
      typeof (infiniteScrollRef.value as any).trigger === 'function'
    ) {
      (infiniteScrollRef.value as any).trigger();
    }
  }
};

function clearSearch() {
  searchString.value = '';
  // applySearchFilter(); // Trigger new search with empty string
}

function toggleLeftDrawer() {
  myDrawer.value?.toggleLeftDrawer();
}

const selectHistoryItem = (item: string) => {
  searchString.value = item;
  // applySearchFilter(); // Trigger new search with history item
};

const clearAllSearchHistory = () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to clear your search history?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    accountSummaryStore.clearSearchHistory();
  });
};

const removeHistoryItem = (itemToRemove: string) => {
  accountSummaryStore.removeSearchFromHistory(itemToRemove);
};

// --- Watchers ---

watch(searchString, (newValue, oldValue) => {
  // `debounce="500"` on q-input ensures `searchString` updates only after 500ms of no typing.
  // Once `searchString` is updated, `applySearchFilter` is called to initiate the search.
  if (newValue !== oldValue) {
    applySearchFilter();
  }
});

// --- Lifecycle Hooks ---

onMounted(() => {
  // Sync the local search input with the persisted filter from the store.
  searchString.value = accountSummaryStore.filter.searchString || '';

  // Check if we are coming back from another page AND have existing data
  const hasExistingData = accountSummaryStore.accounts.length > 0;
  const hasActiveFilter = !!accountSummaryStore.filter.searchString;
  const isReturningWithData =
    hasExistingData && (hasActiveFilter || accountSummaryStore.pageNum > 1); // Check pageNum for scroll position

  if (isReturningWithData) {
    console.log('Returning to page with existing data. Preserving state.');
    // Data is already in the store, just ensure infinite scroll can load more if needed.
    // Do NOT call applySearchFilter, as it would clear and refetch.
    loading.value = false; // Ensure loader is off
    accountSummaryStore.errorMsg = ''; // Clear any potential error messages from previous state
    reachedEnd.value = accountSummaryStore.nextPageUrl === null; // Update reachedEnd based on preserved state

    // Make sure infinite scroll is initialized correctly for further loads.
    // Need to nextTick so q-infinite-scroll has rendered with existing contacts.
    nextTick(() => {
      if (
        infiniteScrollRef.value &&
        typeof (infiniteScrollRef.value as any).reset === 'function'
      ) {
        (infiniteScrollRef.value as any).reset(); // Reset internal scroll state
      }
      if (
        infiniteScrollRef.value &&
        typeof (infiniteScrollRef.value as any).trigger === 'function'
      ) {
        (infiniteScrollRef.value as any).trigger(); // Trigger a check for more data if viewport not full
      }
    });
  } else {
    // This is either a fresh load (no existing data) or a new search after clearing/invalid filter.
    console.log('Fresh load or new search. Applying filter for initial data.');
    applySearchFilter(); // This will handle clearing contacts and fetching the first page.
  }

  // Handle the "Type at least 3 characters" message if the search string is short upon mount
  if (searchString.value.length > 0 && searchString.value.length < 3) {
    accountSummaryStore.accountSummary = []; // Ensure visual contacts are cleared
    accountSummaryStore.errorMsg = 'Type at least 3 characters to search.';
  }
});

onBeforeRouteLeave((to, from) => {
  // Preserve state only if navigating to a contact detail page
  if (to.name !== 'accountDetails') {
    accountSummaryStore.$reset(); // Otherwise, reset the store for a clean slate
  }
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      title="Accounts List"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
    ></OC_Header>

    <OC_Drawer ref="myDrawer" />

    <q-page-container>
      <q-pull-to-refresh @refresh="refresh">
        <q-page>
          <OC_Loader
            :visible="loading"
            message="Loading Accounts, Please wait.."
          />

          <q-input
            v-model="searchString"
            outlined
            debounce="500"
            placeholder="Search accounts (min 3 characters)"
            class="GNL__toolbar-input q-ma-md"
            clearable
            @clear="clearSearch"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <div
            v-if="searchHistory.length > 0"
            class="q-px-md q-pb-sm row items-center no-wrap"
          >
            <div
              class="q-gutter-sm row no-wrap search-history-container"
              style="flex-grow: 1"
            >
              <q-chip
                v-for="(item, index) in searchHistory"
                :key="index"
                clickable
                removable
                @remove="removeHistoryItem(item)"
                color="blue-1"
                text-color="blue-grey-9"
                icon="history"
                @click="selectHistoryItem(item)"
                class="q-chip--small"
              >
                {{ item }}
              </q-chip>
            </div>
            <q-btn
              icon="clear_all"
              round
              flat
              dense
              size="sm"
              color="grey-7"
              aria-label="Clear All Search History"
              @click="clearAllSearchHistory"
            >
              <!-- <q-tooltip>Clear All Search History</q-tooltip> -->
            </q-btn>
          </div>

          <div
            v-if="errorMsg && accounts.length === 0 && !loading"
            class="text-center text-subtitle1 text-grey-7 q-pa-md"
          >
            {{ errorMsg }}
          </div>
          <div
            v-else-if="accounts.length === 0 && !loading && !errorMsg"
            class="text-center text-subtitle1 text-grey-7 q-pa-md"
          >
            No accounts found. Start typing to search.
          </div>

          <q-infinite-scroll
            @load="loadMore"
            :disable="reachedEnd || loading"
            :offset="250"
            ref="infiniteScrollRef"
          >
            <q-list separator>
              <q-item
                v-for="account in accounts"
                :key="account.id"
                clickable
                v-ripple
                :to="{ name: 'accountDetails', params: { id: account.id } }"
              >
                <q-item-section>
                  <q-item-label>{{ account.account_number }} </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ account.account_name }} </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ account.email }} </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="chevron_right" color="primary" />
                </q-item-section>
              </q-item>
            </q-list>

            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px" />
              </div>
            </template>
          </q-infinite-scroll>

          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent" :to="{ name: 'newAccount' }" />
          </q-page-sticky>
        </q-page>
      </q-pull-to-refresh>
    </q-page-container>
  </q-layout>
</template>
<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
.q-chip--small {
  font-size: 0.75rem;
  padding: 4px 8px;
  height: 24px;
}
.search-history-container {
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 5px;
}
.search-history-container::-webkit-scrollbar {
  display: none;
}
.search-history-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
