<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
  routeTo: RouteLocationRaw;
}>();

const router = useRouter();

const navigate = () => {
  if (props.routeTo) {
    router.push(props.routeTo);
  }
};
</script>

<template>
  <q-btn flat round icon="add" @click.stop="navigate" />
</template>
