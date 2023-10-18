<!-- QItem.vue -->
<script lang="ts" setup>
defineProps({
  title: String,
  value: String,
});
</script>
<template>
  <q-item>
    <q-item-section>
      <q-item-label caption>{{ title }}</q-item-label>
      <q-item-label>{{ value }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
