<!-- QItem.vue -->
<script lang="ts" setup>
defineProps({
  label1: String,
  label2: String,
  caption: Boolean,
});
</script>
<template>
  <q-item>
    <q-item-section>
      <q-item-label v-if="caption" caption>{{ label1 }}</q-item-label>
      <q-item-label>{{ label2 }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
