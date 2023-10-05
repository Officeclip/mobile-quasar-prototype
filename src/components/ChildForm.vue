<!-- Child form component -->
<script setup>
const props = defineProps(['testData']);
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-list>
        <q-input
          name="name"
          type="text"
          label="Name"
          v-model="props.testData.name"
        />
        <q-input
          name="email"
          type="email"
          label="Email"
          v-model="props.testData.email"
        />
      </q-list>
    </div>
  </div>
</template>
