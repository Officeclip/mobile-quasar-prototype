<script setup lang="ts">
// import { SectionEntry } from '../../models/contactDetail';
// defineProps({ params: Object });
const props = defineProps(['params'])
 // eslint-disable-next-line vue/no-setup-props-destructure
//  const test: SectionEntry = props.params.visibleName

//  console.log('TEST ABCD', test)

//const sectionEntry = computed(() => props?.visibleName);
</script>

<template>
  <q-item-label caption>{{ props.params?.visibleName }}</q-item-label>
  <q-item-label v-if="props.params?.visible" class="q-mb-md">{{
    props.params?.value
  }}</q-item-label>
  <q-item-label v-else caption class="q-mb-md text-italic">
    <q-icon name="hide_source" /> You do not permission to view this item
  </q-item-label>
</template>
