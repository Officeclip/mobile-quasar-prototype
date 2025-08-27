<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import { useRouter, useRoute } from 'vue-router';
import EditContactDetailsCtrl from '../../components/Contacts/EditContactDetailsCtrl.vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';
import BackButton from '../../components/OCcomponents/Back-Button.vue';
import { ContactDetails } from 'src/models/Contact/contactDetails';
import { useImageDetailStore } from '../../stores/ImageDetail';

const $q = useQuasar();

const contactDetailsStore = useContactDetailsStore();
const imageDetailStore = useImageDetailStore();
const router = useRouter();
const route = useRoute();

const contactDetails: Ref<ContactDetails | null> = ref(null);
const base64Image: Ref<string | null> = ref(null);

const loadContactDetails = async () => {
  $q.loading.show();
  try {
    await contactDetailsStore.getContactDetails(route.params.id as string);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/contactSummary' });
      router.go(0);
    });
  } finally {
    $q.loading.hide();
  }
};

onMounted(async () => {
  await loadContactDetails();
  const response = contactDetailsStore.ContactDetails;
  contactDetails.value = response;
});

const childComponent = ref(null);
const onPhotoSaved = (image: string) => {
  base64Image.value = image;
};

async function onSubmit() {
  $q.loading.show();
  try {
    if (!childComponent.value.validateAll()) return;
    const editContactDetails = ref(contactDetails);
    if (editContactDetails.value) {
      await contactDetailsStore.editContactDetails(editContactDetails.value);
    }
    if (base64Image.value) {
      imageDetailStore.constructImageObjectAndSave(
        contactDetails.value?.id ?? '',
        'Contacts',
        base64Image.value,
      );
    }
    router.go(-1);
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
        <q-toolbar-title> Edit Contact</q-toolbar-title>
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
