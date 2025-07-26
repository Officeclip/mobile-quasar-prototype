<script lang="ts" setup>
import { useContactSummaryStore } from '../../stores/contact/ContactSummaryStore';
import { computed, ref, watch, onMounted, Ref, nextTick } from 'vue';
import { useSessionStore } from 'src/stores/SessionStore';
import { useQuasar } from 'quasar';
import drawer from '../../components/drawer.vue';
import BackButton from '../../components/OCcomponents/Back-Button.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import { onBeforeRouteLeave } from 'vue-router';

// --- Store and Router Initialization ---
const contactSummaryStore = useContactSummaryStore();
const sessionStore = useSessionStore();
const $q = useQuasar();

// --- Component State ---
const loading = ref(false);
const searchString: Ref<string> = ref('');
const reachedEnd = ref(false);
const myDrawer = ref();

const infiniteScrollRef = ref(null);

// --- Computed Properties ---
const contacts = computed(() => contactSummaryStore.contacts);
const errorMsg = computed(() => contactSummaryStore.errorMsg);
const session = computed(() => sessionStore.Session);
const canCreateContact = computed(() => {
  if (!session.value) return false;
  if (session.value.isAdmin) return true;
  return session.value.roleAccess?.some(
    (x) => x.name === 'TimeExpensesCreateTimeSheet' && x.access,
  );
});

const searchHistory = computed(() => contactSummaryStore.searchHistory);

// --- Methods ---

// loadMore is *only* for fetching subsequent pages via infinite scroll.
// It should not be called for the initial page of a new search.
const loadMore = async (index: number, done: () => void) => {
  // Prevent loading if we are already loading or if the current pageNum is 1 (initial load handled elsewhere)
  if (loading.value || contactSummaryStore.pageNum === 1) {
    done();
    return;
  }

  // Ensure there's actually a next page to fetch based on store's nextPageUrl
  if (
    contactSummaryStore.nextPageUrl === null &&
    contactSummaryStore.contacts.length > 0
  ) {
    done(); // Signal end if no next page exists
    return;
  }

  loading.value = true;
  try {
    console.log(
      `Infinite scroll triggered: Fetching page ${contactSummaryStore.pageNum}`,
    );
    reachedEnd.value = await contactSummaryStore.fetchContacts();
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
  contactSummaryStore.setFilter({
    searchString: searchString.value.toLowerCase(),
  });

  // Handle the "type 3 characters" message
  if (searchString.value.length > 0 && searchString.value.length < 3) {
    contactSummaryStore.errorMsg = 'Type at least 3 characters to search.';
    loading.value = false; // Hide loader if no fetch
    return; // Stop here, don't fetch
  }

  // 2. Explicitly fetch the first page of results for the new filter
  try {
    console.log(
      `Applying search filter: Fetching initial page for "${searchString.value}"`,
    );
    reachedEnd.value = await contactSummaryStore.fetchContacts();
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
    contactSummaryStore.clearSearchHistory();
  });
};

const removeHistoryItem = (itemToRemove: string) => {
  contactSummaryStore.removeSearchFromHistory(itemToRemove);
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
  searchString.value = contactSummaryStore.filter.searchString || '';

  // Check if we are coming back from another page AND have existing data
  const hasExistingData = contactSummaryStore.contacts.length > 0;
  const hasActiveFilter = !!contactSummaryStore.filter.searchString;
  const isReturningWithData =
    hasExistingData && (hasActiveFilter || contactSummaryStore.pageNum > 1); // Check pageNum for scroll position

  if (isReturningWithData) {
    console.log('Returning to page with existing data. Preserving state.');
    // Data is already in the store, just ensure infinite scroll can load more if needed.
    // Do NOT call applySearchFilter, as it would clear and refetch.
    loading.value = false; // Ensure loader is off
    contactSummaryStore.errorMsg = ''; // Clear any potential error messages from previous state
    reachedEnd.value = contactSummaryStore.nextPageUrl === null; // Update reachedEnd based on preserved state

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
    contactSummaryStore.contactSummary = []; // Ensure visual contacts are cleared
    contactSummaryStore.errorMsg = 'Type at least 3 characters to search.';
  }
});

onBeforeRouteLeave((to, from) => {
  // Preserve state only if navigating to a contact detail page
  if (to.name !== 'contactDetails') {
    contactSummaryStore.$reset(); // Otherwise, reset the store for a clean slate
  }
});
</script>

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

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <BackButton />
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>Contact List</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <drawer ref="myDrawer" />

    <q-page-container>
      <q-page>
        <OC_Loader :visible="loading" />

        <q-input
          v-model="searchString"
          outlined
          debounce="500"
          placeholder="Search contacts (min 3 characters)"
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
            <q-tooltip>Clear All Search History</q-tooltip>
          </q-btn>
        </div>

        <div
          v-if="errorMsg && contacts.length === 0 && !loading"
          class="text-center text-subtitle1 text-grey-7 q-pa-md"
        >
          {{ errorMsg }}
        </div>
        <div
          v-else-if="contacts.length === 0 && !loading && !errorMsg"
          class="text-center text-subtitle1 text-grey-7 q-pa-md"
        >
          No contacts found. Start typing to search.
        </div>

        <q-infinite-scroll
          @load="loadMore"
          :disable="reachedEnd || loading"
          :offset="250"
          ref="infiniteScrollRef"
        >
          <q-list separator>
            <q-item
              v-for="contact in contacts"
              :key="contact.id"
              clickable
              v-ripple
              :to="{ name: 'contactDetails', params: { id: contact.id } }"
            >
              <q-item-section avatar>
                <q-avatar color="grey-4">
                  <q-img v-if="contact.thumbnail" :src="contact.thumbnail" />
                  <q-icon v-else name="person" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <span v-if="contact.first_name || contact.last_name">
                    {{ contact.first_name }} {{ contact.last_name }}
                  </span>
                  <span v-else>{{ contact.email }}</span>
                </q-item-label>
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
          <q-btn
            v-if="canCreateContact"
            fab
            icon="add"
            color="accent"
            :to="{ name: 'newContact' }"
          />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
