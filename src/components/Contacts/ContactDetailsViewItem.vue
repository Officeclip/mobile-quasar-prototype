<script setup lang="ts">
defineProps({ params: Object });
//const sectionEntry = computed(() => props?.visibleName);
</script>

<template>
  <q-item-label caption>{{ params?.visibleName }}</q-item-label>
  <q-item-label v-if="params?.visible" class="q-mb-md">{{
    params?.value
  }}</q-item-label>
  <q-item-label v-else caption class="q-mb-md text-italic">
    <q-icon name="hide_source" /> You do not permission to view this item
  </q-item-label>
</template>
