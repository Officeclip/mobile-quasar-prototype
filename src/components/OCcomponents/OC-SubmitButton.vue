<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['handleClick']);

const onClick = () => {
  emit('handleClick');
};
</script>
<template>
  <q-btn
    class="q-px-md"
    dense
    label="Submit"
    no-caps
    outline
    rounded
    type="submit"
    @click="onClick"
  />
</template>
