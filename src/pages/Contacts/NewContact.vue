<script setup lang="ts">
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import { useRouter } from 'vue-router';
import EditContactDetailsCtrl from '../../components/Contacts/EditContactDetailsCtrl.vue';
import { ContactDetails } from 'src/models/Contact/contactDetails';
import { ref } from 'vue';
import { useQuasar } from 'quasar';

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
  security: []
});

async function onSubmit(e: any) {
  e.preventDefault();
  try {
    //FIXME: Remove the lint supress line from here. See: https://stackoverflow.com/a/54535439
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await usecontactDetailsStore.addContactDetails(contactDetails);
    router.push('/contactSummary');

  } catch (error) {
    console.log(`*** NewContact:onSubmit(...):catch: ${error} ***`);
    console.log(`---------${error}---------`);
    // $q.notify({
    //   message: error as string,
    //   color: 'red',
    // });
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** NewContact:onSubmit(...):onOK ***');
      // await router.push({ path: '/homePage' });
      // router.go(0);
    });
  }
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
