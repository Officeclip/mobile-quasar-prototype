<!-- eslint-disable vue/valid-v-model -->
<script lang="ts" setup>
console.log('TestForm.vue > setup - started');
import { computed, onMounted, ref, watch } from 'vue';

// const props = defineProps(['testProps', 'isLoading']);
const props = defineProps(['testProps']);
// const accountName = ref('');
// watch([props], () => {
//   accountName.value = props.testProps.accountName;
//   console.log(`watch: ${accountName.value}`);
// });

//defineProps(['testProps']);

// const accountName = computed({
//   get() {
//     return props.testProps?.accountName;
//   },
//   set(newValue) {
//     // eslint-disable-next-line vue/no-mutating-props
//     props.testProps.accountName = newValue;
//   },
// });

// const accountName1 = computed(() => {
//   return props.testProps?.accountName;
// });

//const accountName = ref(props.testProps?.accountName);
// accountName.value = accountName1.value;
//accountName.value = props.testProps?.accountName
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <pre>
      Account Name: {{ props.testProps?.accountName }}
  <!-- Account Name: {{ accountName }} -->
</pre>
    <!-- <q-item-label caption class="q-pt-md"> {{ testProps.accountName }} </q-item-label> -->

    <q-input
      label="xxx:"
      v-if="props.testProps"
      v-model="props.testProps.accountName"
      placeholder="enter here..."
    >
    </q-input>
    <!-- <q-input label="xxx:" v-model="accountName" placeholder="enter here...">
    </q-input> -->
  </div>
</template>
<style></style>
