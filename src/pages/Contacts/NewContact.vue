<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useContactDetailsStore } from 'stores/ContactDetailsStore';
import { useRouter } from 'vue-router';
import EditContactDetailsCtrl from '../../components/Contacts/EditContactDetailsCtrl.vue';
import { useRoute } from 'vue-router';
import { ContactDetails } from 'src/models/Contact/contactDetails';
import { ref } from 'vue';
//import { Contact } from '../models/contact';

const contactDetailsStore = useContactDetailsStore();
//const contact = ref<Contact>();
const route1 = useRouter();
const route = useRoute();

// const contactDetails = computed(() => {
//   return contactDetailsStore.ContactDetails;
// });

const contactDetails: ContactDetails = ref({
  id: Number(''),
  first_name: '',
  last_name: '',
  title: '',
  email: '',
  street_address: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  work_phone: '',
  home_phone: '',
  thumbnail: '',
  picture: ''
});

onMounted(() => {
  console.log(`EditContacts: id= ${route.params.id}`);
  contactDetailsStore.getContactDetails(Number(route.params.id));
});

function onSubmit(e: any) {
  e.preventDefault();

  console.log('onSubmit Contact Value:', contactDetails);

  //FIXME: Remove the lint supress line from here. See: https://stackoverflow.com/a/54535439
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  contactDetailsStore.editContactDetails(contactDetails!);
  route1.push('/contactSummary');
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
