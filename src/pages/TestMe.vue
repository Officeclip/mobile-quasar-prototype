<script setup>
import { shallowRef } from 'vue';
import CompA from '../../src/components/testme/CompA.vue';
import CompB from '../../src/components/testme/CompB.vue';

const current = shallowRef(CompA);
</script>

<template>
  <div class="demo">
    <label><input type="radio" v-model="current" :value="CompA" /> A</label>
    <label><input type="radio" v-model="current" :value="CompB" /> B</label>
    <keep-alive>
      <component :is="current"></component>
    </keep-alive>
  </div>
</template>
