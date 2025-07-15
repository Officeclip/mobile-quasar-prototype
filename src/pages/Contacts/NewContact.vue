<script setup lang="ts">
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import { useRouter } from 'vue-router';
import EditContactDetailsCtrl from '../../components/Contacts/EditContactDetailsCtrl.vue';
import { Ref, ref } from 'vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';
import BackButton from '../../components/OCcomponents/Back-Button.vue';
import { useImageDetailStore } from '../../stores/ImageDetail';

const $q = useQuasar();
const router = useRouter();
const usecontactDetailsStore = useContactDetailsStore();

const base64Image: Ref<string | null> = ref(null);
const imageDetailStore = useImageDetailStore();

const contactDetails = ref({
  //from: https://stackoverflow.com/a/49741799
  id: '',
  thumbnail: '',
  picture: '',
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
  security: {
    read: false,
    write: false,
    append: false,
    delete: false,
  },
});

const childComponent = ref<typeof EditContactDetailsCtrl>();
const onPhotoSaved = (image: string) => {
  base64Image.value = image;
};
async function onSubmit() {
  $q.loading.show();
  try {
    if (!childComponent.value?.validateAll()) return;

    const newContactDetails = ref(contactDetails);
    await usecontactDetailsStore.addContactDetails(newContactDetails.value);
    if (base64Image.value) {
      const contactId = usecontactDetailsStore.ContactId;
      if (contactId) {
        await imageDetailStore.constructImageObjectAndSave(
          contactId,
          'Contacts',
          base64Image.value
        );
      }
    }
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
            @photo-updated="onPhotoSaved"
            ref="childComponent"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
