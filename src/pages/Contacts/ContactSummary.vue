<!--
  TODO: sg/nk: Implement advance search so that the parameters
  is used for data fetch as query string [2h]
 -->
<script lang="ts" setup>
import { useContactSummaryStore } from '../../stores/contact/ContactSummaryStore';
import { computed, ref, Ref, watch } from 'vue';
import { useSessionStore } from 'src/stores/SessionStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import drawer from '../../components/drawer.vue';
import BackButton from '../../components/OCcomponents/Back-Button.vue';
import { searchFilter } from 'src/models/Contact/searchFilter';
import OC_Loader from 'src/components/general/OC_Loader.vue';

const loading = ref(true);
const router = useRouter();
const $q = useQuasar();
const contactSummaryStore = useContactSummaryStore();
const sessionStore = useSessionStore();
const session = sessionStore.Session;
const isAdmin = session.isAdmin;
const isRoleAccess = () => {
  const data = session.roleAccess.find(
    (x) => x.name === 'TimeExpensesCreateTimeSheet'
  );
  return data?.access;
};

const myDrawer = ref();

const defaultSearchOptions: searchFilter = {
  searchString: '',
};

let searchOptions: Ref<searchFilter> = ref({ ...defaultSearchOptions });

const contacts = computed(() => {
  contactSummaryStore.$reset();
  return contactSummaryStore.ContactSummary;
});

const errorMsg = computed(() => {
  return contactSummaryStore.errorMsg;
});

let reachedEnd = ref(false); // indicate if all contacts have been loaded
const loadMore = async (index: any, done: () => void) => {
  loading.value = true;
  try {
    reachedEnd.value = await contactSummaryStore.getUpdatedContacts(false);
    //https://quasar.dev/vue-components/infinite-scroll/#usage
    done();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  } finally {
    loading.value = false;
  }
};

async function filterFn(val: string) {
  if (val.length > 2) {
    searchOptions.value.searchString = val.toLowerCase();
    contactSummaryStore.resetPageNumber();
    contactSummaryStore.setFilter(searchOptions.value);
    await contactSummaryStore.getUpdatedContacts(true);
  }
}

watch(
  () => searchOptions.value.searchString,
  async (newValue) => {
    await filterFn(newValue);
  }
);

function clearSearch() {
  window.location.reload();
}

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
</script>

<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <BackButton />
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Contact List</q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-page-container>
      <q-page>
        <OC_Loader :visible="loading" />
        <q-input
          v-model="searchOptions.searchString"
          class="GNL__toolbar-input q-ma-md"
          debounce="1000"
          clearable
          @clear="clearSearch"
          label="Search"
          outlined
          placeholder="Start typing with min 3 characters to search"
        >
        </q-input>
        <q-item-section v-if="errorMsg !== ''">
          <div class="flex justify-center">
            <span class="text-subtitle1 text-weight-medium inline q-mr-xs">{{
              errorMsg
            }}</span>
          </div>
        </q-item-section>
        <q-infinite-scroll :disable="reachedEnd" @load="loadMore">
          <div v-for="contact in contacts" :key="contact.id">
            <q-item
              v-if="contact.first_name || contact.last_name || contact.email"
              v-ripple
              :to="{
                name: 'contactDetails',
                params: {
                  id: contact.id,
                },
              }"
              clickable
            >
              <q-item-section side>
                <q-avatar color="grey-4">
                  <q-img
                    v-if="contact.thumbnail"
                    v-bind:src="contact.thumbnail"
                  />
                  <q-icon v-else name="person" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <span v-if="contact.first_name || contact.last_name">
                  {{ contact.first_name + ' ' + contact.last_name }}
                </span>
                <span v-else>{{ contact.email }}</span>
              </q-item-section>
              <q-item-section side>
                <q-icon color="primary" name="chevron_right" />
              </q-item-section>
            </q-item>
          </div>
          <template v-slot:loading>
            <q-spinner-dots color="primary" size="40px"></q-spinner-dots>
          </template>
        </q-infinite-scroll>
        <q-separator color="orange" inset />
        <div>
          <q-page-sticky :offset="[18, 18]" position="bottom-right">
            <q-btn
              v-if="isAdmin || isRoleAccess()"
              :to="{ name: 'newContact' }"
              color="accent"
              fab
              icon="add"
              padding="md"
            />
          </q-page-sticky>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
