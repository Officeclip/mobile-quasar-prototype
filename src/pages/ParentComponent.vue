<!-- Parent.vue -->
<script setup>
import ChildForm from '../components/ChildForm.vue';
import { ref } from 'vue';

const testData = ref({
  name: 'abcd',
  email: 'test@gmail.com',
  startDate: '2020-03-04T18:30:00Z',
  isAllDay: false,
});

function onSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = [];
  for (const [name, value] of formData.entries()) {
    data.push({
      name,
      value,
    });
  }
  console.log('form Data input values: ', data);
}
</script>

<template>
  <!-- Form -->
  <q-form ref="formRef" @submit="onSubmit">
    <ChildForm :testData="testData" />
    <q-btn class="q-ml-md" color="primary" label="Save" no-caps type="submit" />
  </q-form>
</template>
