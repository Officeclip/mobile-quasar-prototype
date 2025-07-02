<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <q-btn dense flat icon="west" round @click="goBack" />
</template>
