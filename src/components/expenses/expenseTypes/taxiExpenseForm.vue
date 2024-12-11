<!-- eslint-disable vue/no-setup-props-destructure -->
<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { QInput } from 'quasar';

const props = defineProps(['taxi', 'isDetailRequired']);

const taxiLineNameRef = ref<QInput>();
const cityRef = ref<QInput>();

const ruleNotEmpty = (val: string) => {
  const condition = (val && val.length > 0) || !props.isDetailRequired;
  return condition ? true : 'This field is required';
};

const validateAll = () => {
  taxiLineNameRef.value?.validate();
  cityRef.value?.validate();

  if (taxiLineNameRef.value?.hasError || cityRef.value?.hasError) {
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
        ref="taxiLineNameRef"
        v-model="props.taxi.taxiLineName"
        label="Taxi Line Name"
        :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter taxi line name"
        dense
        lazy-rules
        :rules="[ruleNotEmpty]"
        hide-bottom-space
      >
      </q-input>
      <q-input
        ref="cityRef"
        v-model="props.taxi.city"
        label="City"
        :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter city name"
        dense
        lazy-rules
        :rules="[ruleNotEmpty]"
        hide-bottom-space
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
