<script lang="ts" setup>
console.log('TestForm.vue > setup - started');
import { computed, onMounted, ref } from 'vue';

const props = defineProps(['testProps']);

const accountName = computed(() => {
  return props.testProps;
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <pre>
  Account Name: {{ accountName }}
</pre>
    <q-input label="Account Name:" v-model="accountName.value.accountName" placeholder="enter here...">
    </q-input>
  </div>
</template>
<style></style>
