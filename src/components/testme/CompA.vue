<script lang="ts" setup>
import { ref, watch, computed } from 'vue';

const error = ref('');
const inputValue = ref('');
const startDate = ref('');
const endDate = ref('');

const emit = defineEmits(['validation']);

// const validateInput = () => {
//   console.log(`validateInput: ${inputValue.value}`);

// };

// watch(inputValue, (newValue) => {
//   console.log(`watch: ${newValue}`);
//   inputValue.value = newValue;
//   if (inputValue.value === '') {
//     error.value = 'This field is required';
//     emit('validation', false);
//   } else {
//     error.value = '';
//     emit('validation', true);
//   }
// });

const endDateRule = (value: string) => {
  console.log(`endDateRule: ${value}`);
  if (!value) return false;
  if (!startDate.value) return true;
  const isGreater = new Date(value) > new Date(startDate.value);
  return isGreater;
};

const isEndDateValid = computed(() => {
  const isEndDateValid = endDateRule(endDate.value) === true;
  return isEndDateValid;
});

const validateAll = () => {
  return isEndDateValid.value && isNameValid.value;
};

defineExpose({
  validateAll,
});

const isNameValid = computed(() => {
  const condition = inputValue.value.length > 0;
  return condition;
});
</script>

<template>
  <div>
    <q-input
      v-model="inputValue"
      error-message="Please type something"
      :error="!isNameValid"
      label="Event Name*"
      placeholder="enter event name"
    />
  </div>
  <div>
    <label for="startDate">Start Date:</label>
    <input id="startDate" type="date" v-model="startDate" />
  </div>
  <div>
    <label for="endDate">End Date:</label>
    <input
      id="endDate"
      type="date"
      v-model="endDate"
      :rules="[(val: string) => (val && val.length > 0) || 'Please type something']"
    />
    <span v-if="!isEndDateValid" style="color: red"
      >End date must be later than start date</span
    >
  </div>
</template>
