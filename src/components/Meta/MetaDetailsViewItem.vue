<script setup lang="ts">
const props = defineProps(['params'])
// eslint-disable-next-line vue/no-setup-props-destructure
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
