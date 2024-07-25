<script lang="ts" setup>
import { ref } from 'vue';
import CompA from '../../src/components/testme/CompA.vue';
import dateTimeHelper from '../helpers/dateTimeHelper';

const current = ref('test');
const isValid = ref(false);

const myDate = ref('');
myDate.value = '2024-07-25';

const handleValidation = (valid: boolean) => {
  console.log(`handleValidation: ${isValid.value}`);
  isValid.value = valid;
};

const onSubmit = () => {
  console.log(`onSubmit: ${isValid.value}`);
  if (isValid.value) {
    alert('Form submitted successfully! ' + current.value);
  } else {
    alert('Please correct the errors in the form.');
  }
};
</script>

<template>
  <div class="demo">
    <q-form class="q-gutter-md" @submit="onSubmit">
      <div>
        <pre>
myDate = {{ dateTimeHelper.formatDateTimeFromRestAPIForUI(myDate, true) }}</pre
        >
        <q-date v-model="myDate" mask="YYYY-MM-DD" />
        <CompA :current="current" @validation="handleValidation" />
        <q-btn
          class="q-ml-sm"
          color="primary"
          flat
          label="Submit"
          no-caps
          type="submit"
        />
      </div>
    </q-form>
  </div>
</template>
