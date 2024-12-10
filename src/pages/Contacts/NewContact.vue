<script setup lang="ts">
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import { useRouter } from 'vue-router';
import EditContactDetailsCtrl from '../../components/Contacts/EditContactDetailsCtrl.vue';
import { ContactDetails } from 'src/models/Contact/contactDetails';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';
import BackButton from '../../components/OCcomponents/Back-Button.vue';

const $q = useQuasar();
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
  security: [],
});

const childComponent = ref(null);

async function onSubmit(e: any) {
  // e.preventDefault();
  try {
    //FIXME: Remove the lint supress line from here. See: https://stackoverflow.com/a/54535439
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    if (!childComponent.value.validateAll()) return;

    const newContactDetails = ref(contactDetails);
    await usecontactDetailsStore.addContactDetails(newContactDetails.value);
    router.push('/contactSummary');
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <BackButton />
        <q-toolbar-title> New Contact </q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <EditContactDetailsCtrl
            v-if="contactDetails"
            :fromParentData="contactDetails"
            ref="childComponent"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
