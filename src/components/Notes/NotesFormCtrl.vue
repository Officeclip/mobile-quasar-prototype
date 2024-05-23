<script setup>
import { defineProps, ref } from 'vue';

const options = ref([]);
options.value = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];

const props = defineProps(['note']);
const isPrivate = ref('');
isPrivate.value = props.note.isPrivate ? 'Yes' : 'No';
</script>

<template>
  <!-- FIXME: remove the warning -->
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input v-model="note.title" label="Title" placeholder="enter note title" lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']">
        </q-input>
        <q-editor class="q-mt-none" v-model="note.description" label="Description" paragraph-tag="div"
          placeholder="enter description"></q-editor>
        <q-select v-model="note.isPrivate" :options="options" map-options emit-value label="Private" />
      </div>
    </div>
  </div>
</template>
