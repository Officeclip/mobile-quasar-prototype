<script setup lang="ts">
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import { useRouter } from 'vue-router';
import EditContactDetailsCtrl from '../../components/Contacts/EditContactDetailsCtrl.vue';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';
import BackButton from '../../components/OCcomponents/Back-Button.vue';

const $q = useQuasar();
const router = useRouter();
const usecontactDetailsStore = useContactDetailsStore();

const contactDetails = ref({
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
  security: {
    read: false,
    write: false,
    append: false,
    delete: false,
  },
});

// const childComponent = ref(null);
const childComponent = ref<typeof EditContactDetailsCtrl>();
async function onSubmit() {
  $q.loading.show();
  try {
    if (!childComponent.value?.validateAll()) return;

    const newContactDetails = ref(contactDetails);
    await usecontactDetailsStore.addContactDetails(newContactDetails.value);
    router.push('/contactSummary');
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  } finally {
    $q.loading.hide();
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
