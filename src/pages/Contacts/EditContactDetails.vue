<!--
TODO: skd: Edit the address also with state as a dropdown. It should be done with the
code and not the name [1.5h]
-->
<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import { useRouter, useRoute } from 'vue-router';
import EditContactDetailsCtrl from '../../components/Contacts/EditContactDetailsCtrl.vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';
import logger from 'src/helpers/logger';
import BackButton from '../../components/OCcomponents/Back-Button.vue';

const $q = useQuasar();

const contactDetailsStore = useContactDetailsStore();
const router = useRouter();
const route = useRoute();

const contactDetails = computed(() => {
  return contactDetailsStore.ContactDetails;
});

onMounted(() => {
  contactDetailsStore.getContactDetails(route.params.id as string);
});

const childComponent = ref(null);

async function onSubmit(e: any) {
  // e.preventDefault();
  try {
    //FIXME: Remove the lint supress line from here. See: https://stackoverflow.com/a/54535439
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    if (!childComponent.value.validateAll()) return;

    await contactDetailsStore.editContactDetails(contactDetails.value!);
    // router.push('/contactSummary');
    router.go(-1);
  } catch (error) {
    logger.log(`*** Edit Contact:onSubmit(...):catch: ${error} ***`);
    // $q.notify({
    //   message: error as string,
    //   color: 'red',
    // });
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      logger.log('*** Edit Contact:onSubmit(...):onOK ***');
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
        <BackButton />
        <q-toolbar-title> Edit Contact</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <EditContactDetailsCtrl
            :contactDetails="contactDetails"
            ref="childComponent"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
