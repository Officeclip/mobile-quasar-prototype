<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUpdateChecker } from './composables/useUpdateChecker';

const { checkUpdate } = useUpdateChecker();

onMounted(() => {
  checkUpdate();
});
</script>

<style>
.q-toolbar__title {
  font-size: 1.2rem !important;
}
</style>
