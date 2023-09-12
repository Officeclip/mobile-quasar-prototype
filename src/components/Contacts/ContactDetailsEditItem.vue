<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup lang="ts">
import { ref, computed } from 'vue';
const props = defineProps(['params']);
const newValue = ref('');
newValue.value = props.params?.value;
const getType = computed(() => props.params?.type);
const labelName = computed(() => props.params?.visibleName);
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <q-item-label caption>
    {{ props.params?.visibleName }}
  </q-item-label>
  <div v-if="props.params?.editable" class="q-mb-md">
    <q-input
      v-if="getType === 'string'"
      name="stringnewValue"
      class="min-width"
      type="text"
      :label="labelName"
      placeholder="enter task subject"
      v-model="newValue"
    />
  </div>
  <div v-else caption class="q-mb-md text-italic">
    <q-icon name="hide_source" /> You do not permission to edit this item
  </div>
</template>
