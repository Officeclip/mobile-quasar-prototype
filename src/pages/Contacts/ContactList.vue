<!--
  TODO: sg/nk: Implement advance search so that the parameters
  is used for data fetch as query string [2h]
 -->

<script lang="ts" setup>
import {useContactsStore} from '../../stores/ContactsStore';
import {onMounted} from 'vue';
import {ref, computed} from 'vue';

const contactsStore = useContactsStore();

const currentPage = ref(1); // the current page number
const pageSize = ref(10); // number of items in one page
const numItems = ref<number>(0); // total number of items in the list
const text = ref('');

const batchNumber = ref(1); // the current number of batches loaded using infinite scroll
const batchSize = ref(10); // number of contacts to load in each batch

const contacts = computed(() => {
  return contactsStore.Contacts;
});

onMounted(() => {
  contactsStore.$reset(); // FIXME: This is a safeguard and can be removed
  contactsStore.getContacts1(batchSize.value, batchNumber.value);
  batchNumber.value++;
  // contactsStore.getContacts();
  //contacts.value = contactsStore.Contacts;
  console.log(`onMounted: Contacts - ${contactsStore.Contacts}`);
});
const loadMore = (index: any, done: () => void) => {
  setTimeout(() => {
    contactsStore.getContacts1(batchSize.value, batchNumber.value);
    batchNumber.value++;
    done();
  }, 1000)
}

const totalPages = computed(() => {
  //console.log(`totalPages: ${numItems.value}/${pageSize.value}`);
  return Math.ceil(numItems.value / pageSize.value);
});

const getData = computed(() => {
  if (contacts.value.length === 0) {
    return null;
  }
  // First we need to filter the contact with any strings
  const filteredContacts =
    text.value.length === 0
      ? contacts.value
      : contacts.value.filter((t) => {
        return t.first_name.toLowerCase().includes(text.value.toLowerCase());
      });
  //console.log(`getData - contacts length: ${contacts.length}, filteredContacts length: ${filteredContacts.length}`)

  //FIXME: Remove the lint supress line from here. See: https://stackoverflow.com/a/54535439
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  numItems.value = filteredContacts.length;

  // console.log(
  //   `getData- numItems:${numItems.value}, currentPage:${currentPage.value}, totalPages:${totalPages.value}`
  // );
  // const firstIndex = (currentPage.value - 1) * pageSize.value;
  // const lastIndex = firstIndex + pageSize.value;
  // console.log(`getData- firstIndex:${firstIndex}, lastIndex:${lastIndex}`);
  // const contactsInPage = filteredContacts.slice(firstIndex, lastIndex);
  // return contactsInPage;
  return filteredContacts;
});
</script>

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
        <q-space/>
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
          placeholder="Search for contact, locations & sources"
        >
          <template v-slot:prepend>
            <q-icon v-if="text === ''" name="search"/>
            <q-icon
              v-else
              class="cursor-pointer"
              name="clear"
              @click="text = ''"
            />
          </template>
        </q-input>

        <q-infinite-scroll :offset="250" @load="loadMore">
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
                <img v-bind:src="contact.thumbnail"/>
              </q-avatar>
            </q-item-section>
            <q-item-section>{{ contact.first_name }}</q-item-section>
            <q-item-section side>
              <q-icon color="primary" name="chevron_right"/>
            </q-item-section>
          </q-item>
          <template v-slot:loading>
            <q-spinner-dots color="primary" size="40px"></q-spinner-dots>
          </template>
        </q-infinite-scroll>
        <div>
          <q-page-sticky :offset="[18, 18]" position="bottom-right">
            <q-btn
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

<style></style>
