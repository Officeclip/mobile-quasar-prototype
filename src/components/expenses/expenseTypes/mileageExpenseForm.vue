<!-- eslint-disable vue/no-setup-props-destructure -->
<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { QInput } from 'quasar';

const props = defineProps(['mileage', 'isDetailRequired']);

const dense = ref(false);
const mileageRef = ref<QInput>();
const ruleNotEmpty = (val: string) => {
  const condition = (val && val.length > 0) || !props.isDetailRequired;
  return condition ? true : 'This field is required';
};

const validateAll = () => {
  mileageRef.value?.validate();

  if (mileageRef.value?.hasError) {
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
        ref="mileageRef"
        type="number"
        v-model="props.mileage.mileage"
        label="Mileage"
        :label-color="props.isDetailRequired ? 'red' : ''"
        placeholder="enter mileage"
        :dense="dense"
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
