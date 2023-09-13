<!--
TODO: skd: Edit the address also with state as a dropdown. It should be done with the
code and not the name [1.5h]
-->

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useContactsStore } from '../../stores/ContactsStore';
import { useRouter } from 'vue-router';
import EditContactSummaryCtrl from '../../components/Contacts/EditContactSummaryCtrl.vue';
import { useRoute } from 'vue-router';
//import { Contact } from '../models/contact';

const contactsStore = useContactsStore();
//const contact = ref<Contact>();
const route1 = useRouter();
const route = useRoute();

const contact = computed(() => {
  return contactsStore.Contact;
});

onMounted(() => {
  console.log(`EditContacts: id= ${route.params.id}`);
  contactsStore.getContactSummary(Number(route.params.id));
});

function onSubmit(e: any) {
  e.preventDefault();

  console.log(`onSubmit Contact Value: ${contact.value}`);

  //FIXME: Remove the lint supress line from here. See: https://stackoverflow.com/a/54535439
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  contactsStore.editContact(contact.value!);
  route1.push('/contactList');
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Edit Contact</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <EditContactSummaryCtrl :contact="contact" />
          <q-btn
            class="q-ml-md q-mb-md"
            label="Submit"
            type="submit"
            color="primary"
          >
          </q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
