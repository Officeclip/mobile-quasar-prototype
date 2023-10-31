<script lang="ts" setup>
console.log('TestForm.vue > setup - started');
import { computed, onMounted, ref } from 'vue';

const props = defineProps(['testProps']);

const accountName = computed(() => {
  return props.testProps?.accountName;
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <pre>
  Account Name: {{ accountName }}
</pre
    >
  </div>
</template>
<style></style>
