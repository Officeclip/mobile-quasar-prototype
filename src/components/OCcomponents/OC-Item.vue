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
      <q-item-label caption v-if="title">{{ title }}</q-item-label>
      <q-item-label v-if="value">{{ value }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
