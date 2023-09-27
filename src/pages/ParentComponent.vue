<!-- Parent.vue -->
<script setup>
import ChildForm from '../components/ChildForm.vue';
import { ref } from 'vue';

const testData = ref({
  name: 'abcd',
  email: 'test@gmail.com',
});

function onSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const newname = formData.get('name');
  const newEmail = formData.get('email');
  console.log('Printing the name property:', newname);
  console.log('Printing the email property:', newEmail);
}
</script>

<template>
  <!-- Form -->
  <q-form ref="mainForm" @submit="onSubmit">
    <ChildForm :testData="testData" />
    <!-- <q-btn class="q-ml-md" color="primary" label="Save" no-caps type="submit" /> -->
  </q-form>
  <q-btn
    class="q-ml-md"
    color="primary"
    label="Save from Outside"
    no-caps
    type="submit"
    @click="onSubmit"
  />
</template>
