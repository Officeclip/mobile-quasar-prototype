<!-- QItem.vue -->
<script lang="ts" setup>
defineProps({
  title: String,
  value: String,
  caption: Boolean,
});
</script>
<template>
  <q-item>
    <q-item-section>
      <q-item-label v-if="caption" caption>{{ title }}</q-item-label>
      <q-item-label>{{ value }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
