<!--
  TODO: sg/nk: Implement advance search so that the parameters
  is used for data fetch as query string [2h]
 -->
<script lang="ts" setup>
import { useContactSummaryStore } from '../../stores/contact/ContactSummaryStore';
import { computed, ref } from 'vue';
import { useSessionStore } from 'src/stores/SessionStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

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

const text = ref('');

let numItems = ref(0); // total number of items in the list

const contacts = computed(() => {
  contactSummaryStore.$reset();
  return contactSummaryStore.ContactSummary;
});
let reachedEnd = ref(false); // indicate if all contacts have been loaded
const loadMore = async (index: any, done: () => void) => {
  try {
    reachedEnd.value = await contactSummaryStore.getUpdatedContacts();
    //https://quasar.dev/vue-components/infinite-scroll/#usage
    done();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
};

const getData = computed(() => {
  if (contacts?.value.length === 0) {
    return null;
  }
  // First we need to filter the contact with any strings
  //const searchText = text.value.toLowerCase();
  const filteredContacts =
    text.value.length === 0
      ? contacts.value
      : contacts.value.filter((t: any) => {
          return (
            t.first_name.toLowerCase().includes(text.value.toLowerCase()) ||
            t.last_name.toLowerCase().includes(text.value.toLowerCase())
          );
        });

  //FIXME: Remove the lint suppress line from here. See: https://stackoverflow.com/a/54535439
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  numItems.value = filteredContacts.length;
  return filteredContacts;
});
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
        <q-btn
          color="white"
          dense
          flat
          icon="arrow_back"
          round
          @click="$router.go(-1)"
        >
        </q-btn>
        <q-toolbar-title> Contact List</q-toolbar-title>
        <q-space />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-input
          v-model="text"
          class="GNL__toolbar-input q-ma-md"
          color="bg-grey-7 shadow-1"
          dense
          outlined
          placeholder="Search for a contact"
        >
          <template v-slot:prepend>
            <q-icon v-if="text === ''" name="search" />
            <q-icon
              v-else
              class="cursor-pointer"
              name="clear"
              @click="text = ''"
            />
          </template>
        </q-input>
        <q-infinite-scroll :disable="reachedEnd" @load="loadMore">
          <q-item
            v-for="contact in getData"
            :key="contact.id"
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
                <q-icon name="image" v-else />
              </q-avatar>
            </q-item-section>
            <q-item-section>{{
              contact.first_name.length > 0
                ? contact.first_name + ' ' + contact.last_name
                : contact.last_name
            }}</q-item-section>
            <q-item-section side>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
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
              padding="sm"
            />
          </q-page-sticky>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
