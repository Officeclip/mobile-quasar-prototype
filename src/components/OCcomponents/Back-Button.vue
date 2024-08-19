<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <q-btn dense flat icon="arrow_back" round @click="goBack" />
</template>
