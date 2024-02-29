<script setup lang="ts">
import { useContactDetailsStore } from 'stores/ContactDetailsStore';
import { useRouter } from 'vue-router';
import EditContactDetailsCtrl from '../../components/Contacts/EditContactDetailsCtrl.vue';
import { useRoute } from 'vue-router';
import { ContactDetails } from 'src/models/Contact/contactDetails';
import { ref, computed, onMounted } from 'vue';
const router = useRouter();
const route = useRoute();

const usecontactDetailsStore = useContactDetailsStore();

onMounted(() => {
  //usecontactDetailsStore.getContactLists();
});

// const getStates = computed(() => {
//   return usecontactDetailsStore.states;
// });

// const defaultState = computed(() => {
//   return getStates.value.find((state) => state.is_default);
// });

// const getCountries = computed(() => {
//   return usecontactDetailsStore.countries;
// });

// const defaultCountry = computed(() => {
//   return getCountries.value.find((country) => country.is_default);
// });

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
  state_id: '',
  postal_code: '',
  country_name: '',
  country_id: '',
  work_phone: '',
  home_phone: '',
  thumbnail: '',
  picture: '',
});

//const contactDetails = { current: contactDetailsEmpty };
//contactDetails.value = contactDetailsEmpty;

// onMounted(() => {
//   console.log(`EditContacts: id= ${route.params.id}`);
//   contactDetailsStore.getContactDetails(Number(route.params.id));
// });

function onSubmit(e: any) {
  e.preventDefault();

  console.log('New contact values in new contact:', contactDetails);

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
