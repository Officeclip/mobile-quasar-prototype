<!--
TODO: skd: Edit the address also with state as a dropdown. It should be done with the
code and not the name [1.5h]
-->
<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import { useRouter, useRoute } from 'vue-router';
import EditContactDetailsCtrl from '../../components/Contacts/EditContactDetailsCtrl.vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';
import BackButton from '../../components/OCcomponents/Back-Button.vue';
import { ContactDetails } from 'src/models/Contact/contactDetails';

const $q = useQuasar();

const contactDetailsStore = useContactDetailsStore();
const router = useRouter();
const route = useRoute();

const contactDetails: Ref<ContactDetails> = ref(null);

onMounted(async () => {
  await contactDetailsStore.getContactDetails(route.params.id as string);
  const respone = contactDetailsStore.ContactDetails;
  contactDetails.value = respone;
});

const childComponent = ref(null);

async function onSubmit(e: any) {
  // e.preventDefault();
  try {
    if (!childComponent.value.validateAll()) return;

    await contactDetailsStore.editContactDetails(contactDetails.value!);
    router.go(-1);
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
            ref="childComponent"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
