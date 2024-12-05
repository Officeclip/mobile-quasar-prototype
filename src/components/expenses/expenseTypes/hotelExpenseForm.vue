<!-- eslint-disable vue/no-setup-props-destructure -->
<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { QInput } from 'quasar';

const props = defineProps(['hotel', 'isDetailRequired']);

const dense = ref(false);

const hotelNameRef = ref<QInput>(); // from: https://stackoverflow.com/a/65106524
const cityRef = ref<QInput>();
const fromDateRef = ref<QInput>();
const toDateRef = ref<QInput>();

const ruleNotEmpty = (val: string) => {
  const condition = (val && val.length > 0) || !props.isDetailRequired;
  return condition ? true : 'This field is required';
};

const validateAll = () => {
  hotelNameRef.value?.validate();
  cityRef.value?.validate();
  fromDateRef.value?.validate();
  toDateRef.value?.validate();

  if (
    hotelNameRef.value?.hasError ||
    cityRef.value?.hasError ||
    fromDateRef.value?.hasError ||
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
        ref="hotelNameRef"
        v-model="props.hotel.hotelName"
        label="Hotel Name"
        :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter hotel name"
        :dense="dense"
        lazy-rules
        :rules="[ruleNotEmpty]"
      >
      </q-input>
      <q-input
        ref="cityRef"
        v-model="props.hotel.city"
        label="City"
        :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter city name"
        :dense="dense"
        lazy-rules
        :rules="[ruleNotEmpty]"
      >
      </q-input>
      <q-input
        ref="fromDateRef"
        type="date"
        name="fromDate"
        v-model="props.hotel.fromDate"
        label="From Date"
        :label-color="props.isDetailRequired ? 'red' : ''"
        :rules="[ruleNotEmpty]"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="props.hotel.fromDate" mask="YYYY-MM-DD">
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
        v-model="props.hotel.toDate"
        label="To Date"
        :label-color="props.isDetailRequired ? 'red' : ''"
        :rules="[ruleNotEmpty]"
      >
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="props.hotel.toDate" mask="YYYY-MM-DD">
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
