<script lang="ts" setup>
import { useContactSummaryStore } from '../../stores/contact/ContactSummaryStore';
import { computed, ref, watch, onUnmounted, Ref } from 'vue';
import { useSessionStore } from 'src/stores/SessionStore';
import { useQuasar } from 'quasar';
import drawer from '../../components/drawer.vue';
import BackButton from '../../components/OCcomponents/Back-Button.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';

// --- Store and Router Initialization ---
const contactSummaryStore = useContactSummaryStore();
const sessionStore = useSessionStore();
const $q = useQuasar();

// --- Component State ---
const loading = ref(false);
const searchString: Ref<string> = ref('');
const reachedEnd = ref(false); // Local state to disable infinite scroll
const myDrawer = ref(); // Ref for the drawer component

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

// --- Methods ---

/**
 * Loads the next page of contacts for the q-infinite-scroll component.
 */
const loadMore = async (index: number, done: () => void) => {
  if (loading.value) {
    done();
    return;
  }
  loading.value = true;
  try {
    reachedEnd.value = await contactSummaryStore.fetchContacts();
  } catch (error) {
    $q.dialog({
      title: 'Error',
      message: 'An unexpected error occurred: ' + error.message,
    });
    reachedEnd.value = true; // Stop trying to load on error
  } finally {
    loading.value = false;
    done();
  }
};

/**
 * Clears the search input, which triggers the watcher to reload the list.
 */
const clearSearch = () => {
  searchString.value = '';
};

function toggleLeftDrawer() {
  myDrawer.value?.toggleLeftDrawer();
}

// --- Watchers ---

watch(searchString, async (newValue) => {
  // Perform search if length is >= 3 or if the search is cleared.
  if (newValue.length >= 3 || newValue.length === 0) {
    loading.value = true;
    contactSummaryStore.setFilter({ searchString: newValue.toLowerCase() });
    reachedEnd.value = false; // Reset for new search result

    // Fetch the first page of the new search results.
    // The infinite scroll will handle subsequent pages.
    try {
      reachedEnd.value = await contactSummaryStore.fetchContacts();
    } finally {
      loading.value = false;
    }
  }
});

// --- Lifecycle Hooks ---

// Reset the store when the component is unmounted to ensure a fresh state on next visit.
onUnmounted(() => {
  contactSummaryStore.$reset();
});
</script>

<style scoped></style>

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
          v-if="errorMsg && contacts.length === 0"
          class="text-center text-subtitle1 text-grey-7 q-pa-md"
        >
          {{ errorMsg }}
        </div>

        <q-infinite-scroll
          @load="loadMore"
          :disable="reachedEnd || loading"
          :offset="250"
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
