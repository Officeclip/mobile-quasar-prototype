<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup lang="ts">
import { ref, computed } from 'vue';
const props = defineProps(['params']);
const newValue = ref('');
newValue.value = props.params?.value;
const getType = computed(() => props.params?.type);
const labelName = computed(() => props.params?.visibleName);
const controlName = computed(() => `name_${props.params?.metaId}`);
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->

  <div v-if="props.params?.editable" class="q-mb-md">
    <q-input
      v-if="getType === 'string'"
      :name="controlName"
      class="min-width"
      type="text"
      :label="labelName"
      v-model="newValue"
    />
    <q-input
      v-if="getType === 'number'"
      name="controlName"
      class="min-width"
      type="number"
      :label="labelName"
      v-model="newValue"
    />
    <q-toggle
      v-if="getType === 'boolean'"
      name="controlName"
      :label="labelName"
      :false-value="false"
      :true-value="true"
      color="primary"
      keep-color
      v-model="newValue"
    ></q-toggle>
    <q-select
      v-if="getType === 'select'"
      name="controlName"
      map-options
      class="min-width"
      v-model="newValue"
      :options="props.params?.options"
      option-label="name"
      :label="labelName"
    />
  </div>
  <div v-else caption class="q-mb-md text-italic">
    <q-item-label caption>
      {{ labelName }}
    </q-item-label>
    <q-item-label class="q-mb-sm">
      {{ newValue }}
    </q-item-label>
    <q-icon name="hide_source" /> You do not permission to edit this item
  </div>
</template>
