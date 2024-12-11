<!-- eslint-disable vue/no-setup-props-destructure -->
<script lang="ts" setup>
import { defineProps, ref } from 'vue';

const props = defineProps(['autoRental', 'isDetailRequired']);
import { QInput } from 'quasar';

const rentalAgencyRef = ref<QInput>(); // from: https://stackoverflow.com/a/65106524
const cityRef = ref<QInput>();
const fromDateeRef = ref<QInput>();
const toDateRef = ref<QInput>();
const ruleNotEmpty = (val: string) => {
  const condition = (val && val.length > 0) || !props.isDetailRequired;
  return condition ? true : 'This field is required';
};

const validateAll = () => {
  rentalAgencyRef.value?.validate();
  cityRef.value?.validate();
  fromDateeRef.value?.validate();
  toDateRef.value?.validate();

  if (
    rentalAgencyRef.value?.hasError ||
    cityRef.value?.hasError ||
    fromDateeRef.value?.hasError ||
    toDateRef.value?.hasError
  ) {
    return false;
  } else {
    return true;
  }
};

defineExpose({
  validateAll,
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-input
        ref="rentalAgencyRef"
        v-model="props.autoRental.rentalAgency"
        label="Rental Agency"
        :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter rental agency name"
        dense
        lazy-rules
        :rules="[ruleNotEmpty]"
        hide-bottom-space
      >
      </q-input>
      <q-input
        ref="cityRef"
        v-model="props.autoRental.city"
        label="City"
        :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter city name"
        dense
        lazy-rules
        :rules="[ruleNotEmpty]"
        hide-bottom-space
      >
      </q-input>
      <q-input
        ref="fromDateeRef"
        type="date"
        name="fromDate"
        v-model="props.autoRental.fromDate"
        label="From Date"
        :label-color="props.isDetailRequired ? 'red' : ''"
        :rules="[ruleNotEmpty]"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="props.autoRental.fromDate" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat label="Close" />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        ref="toDateRef"
        type="date"
        name="toDate"
        v-model="props.autoRental.toDate"
        label="To Date"
        :label-color="props.isDetailRequired ? 'red' : ''"
        :rules="[ruleNotEmpty]"
        hide-bottom-space
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="props.autoRental.toDate" mask="YYYY-MM-DD">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat label="Close" />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>
<style scoped>
.required {
  color: red;
}
</style>
