<!-- eslint-disable vue/no-setup-props-destructure -->
<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { QInput } from 'quasar';

const props = defineProps(['telephone', 'isDetailRequired']);

const dense = ref(false);
const phoneNumberRef = ref<QInput>();
const cityRef = ref<QInput>();

const ruleNotEmpty = (val: string) => {
  const condition = (val && val.length > 0) || !props.isDetailRequired;
  return condition ? true : 'This field is required';
};

const validateAll = () => {
  phoneNumberRef.value?.validate();
  cityRef.value?.validate();

  if (phoneNumberRef.value?.hasError || cityRef.value?.hasError) {
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
        ref="phoneNumberRef"
        v-model="props.telephone.phoneNumber"
        label="Phone Number"
        :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter phone number"
        :dense="dense"
        lazy-rules
        :rules="[ruleNotEmpty]"
      >
      </q-input>
      <q-input
        ref="cityRef"
        v-model="props.telephone.city"
        label="City"
        :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter city name"
        :dense="dense"
        lazy-rules
        :rules="[ruleNotEmpty]"
      >
      </q-input>
    </div>
  </div>
</template>
<style scoped>
.required {
  color: red;
}
</style>
