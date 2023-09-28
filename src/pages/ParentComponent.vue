<!-- Parent.vue -->
<script setup>
import ChildForm from '../components/ChildForm.vue';
import { ref } from 'vue';

const testData = ref({
  name: 'abcd',
  email: 'test@gmail.com',
});
const formRef = ref(null);

function onSubmit(e) {
  console.log('printing the e', e);
  // e.preventDefault();
  const form = formRef.value;
  console.log('test form variable', form);
  const formData = new FormData(form);
  // console.log('test the e.target', e.target);
  // const formData = new FormData(e.target);
  const newname = formData.get('name');
  const newEmail = formData.get('email');
  console.log('Printing the name property:', newname);
  console.log('Printing the email property:', newEmail);
  // console.log('Printing the name property:', testData.value.name);
  // console.log('Printing the email property:', testData.value.email);
}
</script>

<template>
  <!-- Form -->
  <q-form ref="formRef" @submit="onSubmit">
    <ChildForm :testData="testData" />
    <q-btn
      class="q-ml-md"
      color="primary"
      label="Save"
      no-caps
      type="submit"
      @click="onSubmit(formRef)"
    />
  </q-form>
  <!-- <q-btn
    class="q-ml-md"
    color="primary"
    label="Save from Outside"
    no-caps
    type="submit"
    @click="onSubmit(formRef)"
  /> -->
</template>
