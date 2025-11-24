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
  count: number;
}

defineProps<{
  tabs: Tab[];
  tab: string;
  addRoute: RouteLocationRaw;
}>();

defineEmits(['update:tab']);

const tabDetails: { [key: string]: { label: string; icon: string } } = {
  notes: { label: 'Notes', icon: 'subject' },
  events: { label: 'Events', icon: 'calendar_month' },
  tasks: { label: 'Tasks', icon: 'checklist' },
};

const getTabDetail = (tabName: string) => {
  return tabDetails[tabName] || { label: tabName, icon: 'help' };
};
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
        inline-label
      >
        <q-tab
          v-for="t in tabs"
          :key="t.name"
          :name="t.name"
          :label="getTabDetail(t.name).label"
          :icon="getTabDetail(t.name).icon"
        >
          <q-badge v-if="t.count > 0" class="q-ml-sm">{{ t.count }}</q-badge>
        </q-tab>
      </q-tabs>
    </q-footer>
  </div>
</template>
