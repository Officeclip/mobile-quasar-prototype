<script setup lang="ts">
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import { useRouter } from 'vue-router';
import EditContactDetailsCtrl from '../../components/Contacts/EditContactDetailsCtrl.vue';
import { ContactDetails } from 'src/models/Contact/contactDetails';
import { ref } from 'vue';

const router = useRouter();
const usecontactDetailsStore = useContactDetailsStore();

//TODO: CR: 2024-05-17: nk: Fix the below type error?
const contactDetails: ContactDetails = ref({
  //from: https://stackoverflow.com/a/49741799
  id: '',
  first_name: '',
  last_name: '',
  title: '',
  email: '',
  street_address: '',
  city: '',
  state_name: '',
  state_id: 0,
  postal_code: '',
  country_name: '',
  country_id: 0,
  work_phone: '',
  home_phone: '',
  thumbnail: '',
  picture: '',
  security: []
});

function onSubmit(e: any) {
  e.preventDefault();
  //FIXME: Remove the lint supress line from here. See: https://stackoverflow.com/a/54535439
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  usecontactDetailsStore.addContactDetails(contactDetails);
  router.push('/contactSummary');
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title> New Contact </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <EditContactDetailsCtrl :contactDetails="contactDetails" />
          <q-btn class="q-ml-md q-mb-md" label="Submit" type="submit" color="primary">
          </q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
src/stores/contact/ContactDetailsStore
