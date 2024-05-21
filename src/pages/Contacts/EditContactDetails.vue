<!--
TODO: skd: Edit the address also with state as a dropdown. It should be done with the
code and not the name [1.5h]
-->
<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import { useRouter } from 'vue-router';
import EditContactDetailsCtrl from '../../components/Contacts/EditContactDetailsCtrl.vue';
import { useRoute } from 'vue-router';

const contactDetailsStore = useContactDetailsStore();
const route1 = useRouter();
const route = useRoute();

const contactDetails = computed(() => {
  return contactDetailsStore.ContactDetails;
});

onMounted(() => {
  contactDetailsStore.getContactDetails(route.params.id as string);
});

function onSubmit(e: any) {
  e.preventDefault();

  //FIXME: Remove the lint supress line from here. See: https://stackoverflow.com/a/54535439
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  contactDetailsStore.editContactDetails(contactDetails.value!);
  route1.push('/contactSummary');
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title> Edit Contact</q-toolbar-title>
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
