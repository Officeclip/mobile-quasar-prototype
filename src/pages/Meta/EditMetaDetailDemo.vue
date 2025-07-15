<script setup lang="ts">
import { computed } from 'vue';
import EditMetaDetailCtrl from 'src/components/Meta/Demo/EditMetaDetailCtrl.vue';
import { useRoute, useRouter } from 'vue-router';
// import { MetaDetails } from 'src/models/Meta/metaDetails';

// const metaData = ref<MetaDetails | undefined>();
const route = useRoute();
const router = useRouter();

const contactId = computed(() => {
  return route.params.id;
});

function onSubmit(e: any) {
  // This function will handle the form submission
  // You can access the form data and perform any necessary actions here
  console.log('Form submitted');
  // For example, you can send the data to an API or update the state
  const formData = new FormData(e.target);
  const data: Record<string, FormDataEntryValue> = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  console.log('Form Data:', data);
  // You can also navigate to another page if needed
  // router.push({ name: 'SomeOtherPage' });
}

// function onSubmit(e) {
//   e.preventDefault();
//   const formData = new FormData(e.target);
//   const data = [];
//   for (const [name, value] of formData.entries()) {
//     data.push({
//       name,
//       value,
//     });
//   }
// }
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          @click="router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Edit Contact</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <EditMetaDetailCtrl :id="contactId" />
          <q-btn
            class="q-ml-md q-mb-md"
            label="Submit"
            type="submit"
            color="primary"
          >
          </q-btn>
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
