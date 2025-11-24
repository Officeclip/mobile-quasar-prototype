<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { RouteLocationRaw } from 'vue-router';

const $q = useQuasar();
const footerClass = computed(() =>
  $q.dark && $q.dark.isActive ? 'bg-grey-9' : 'bg-primary',
);

interface Tab {
  name: string;
  label: string;
  icon: string;
  count: number;
  show: boolean;
}

defineProps<{
  tabs: Tab[];
  tab: string;
  addRoute: RouteLocationRaw;
}>();

defineEmits(['update:tab']);
</script>

<template>
  <div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" :to="addRoute" />
    </q-page-sticky>

    <q-footer>
      <q-tabs
        :model-value="tab"
        @update:model-value="$emit('update:tab', $event)"
        align="justify"
        dense
        :class="footerClass"
        indicator-color="warning"
        inline-label
      >
        <template v-for="t in tabs" :key="t.name">
          <q-tab v-if="t.show" :name="t.name" :label="t.label" :icon="t.icon">
            <q-badge v-if="t.count > 0" class="q-ml-sm">{{ t.count }}</q-badge>
          </q-tab>
        </template>
      </q-tabs>
    </q-footer>
  </div>
</template>
