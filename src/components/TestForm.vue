<script lang="ts" setup>
console.log('TestForm.vue > setup - started');
import { computed, onMounted, ref } from 'vue';

const props = defineProps(['testProps']);

const testProps = computed(() => {
  return props.testProps.accountName;
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <pre>
  Account Name: {{ testProps }}
</pre>
    <!-- <q-item-label caption class="q-pt-md"> {{ testProps.accountName }} </q-item-label> -->
    <!-- <q-input label="Account Name:" v-model="testProps.accountName" placeholder="enter here...">
    </q-input> -->
  </div>
</template>
<style></style>
