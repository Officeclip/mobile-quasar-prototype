<script setup>
import ChildForm from '../components/ChildForm.vue';
import { ref } from 'vue';

const testData = ref({
  name: 'abcd',
  email: 'test@gmail.com',
});

const formRef = ref(null);

function onSubmit(e) {
  e.preventDefault();

  // Get the form element.
  const form = formRef.value;

  // Get the form data.
  const formData = new FormData(form);

  // Get the name and email properties from the form data.
  const newname = formData.get('name');
  const newEmail = formData.get('email');

  console.log('Printing the name property:', newname);
  console.log('Printing the email property:', newEmail);
}
</script>

<template>
  <q-form ref="formRef" @submit="onSubmit">
    <ChildForm :testData="testData" />
  </q-form>

  <q-btn
    class="q-ml-md"
    color="primary"
    label="Save"
    no-caps
    type="submit"
    @click="onSubmit(event)"
  />
</template>
