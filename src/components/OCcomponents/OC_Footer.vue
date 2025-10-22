<template>
  <q-footer bordered>
    <q-tabs
      :model-value="tab"
      @update:model-value="$emit('update:tab', $event)"
      align="justify"
      dense
    >
      <q-tab
        v-for="t in tabs"
        :key="t.name"
        :name="t.name"
        :label="t.label"
        :icon="t.icon"
      />
    </q-tabs>
  </q-footer>
</template>

<script setup lang="ts">
interface Tab {
  name: string;
  label: string;
  icon: string;
}

defineProps<{
  tabs: Tab[];
  tab: string;
}>();

defineEmits(['update:tab']);
</script>