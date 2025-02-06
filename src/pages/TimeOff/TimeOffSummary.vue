<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTimeOffStore } from 'src/stores/timeOff/timeOffStore';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import drawer from '../../components/drawer.vue';

const timeOffStore = useTimeOffStore();
const router = useRouter();
const $q = useQuasar();
const myDrawer = ref();

const tab = ref('my-requests'); // Default tab
const timeOffSummaries = computed(() => timeOffStore.TimeOffSummaries);

const loadTimeOffSummaries = async (tabValue: string) => {
  try {
    await timeOffStore.getTimeOffSummariesFake(tabValue);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/homePage' });
      router.go(0);
    });
  }
};

onMounted(() => {
  loadTimeOffSummaries(tab.value);
});

const handleTabClick = (tabValue: string) => {
  tab.value = tabValue;
  loadTimeOffSummaries(tabValue);
};

const toggleLeftDrawer = () => {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar class="glossy">
        <q-btn
          @click="router.push({ path: '/homepage' })"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>Time Off({{ tab }})</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-page-container>
      <q-page>
        <q-tabs
          v-model="tab"
          @update:model-value="handleTabClick"
          no-caps
          inline-label
          align="justify"
        >
          <q-tab name="my-requests" label="My Requests" icon="outbox" />
          <q-tab name="inbox" label="Inbox" icon="inbox"> </q-tab>

          <q-tab name="archived" label="Archived" icon="archive" />
        </q-tabs>

        <q-list v-for="summary in timeOffSummaries" :key="summary.id">
          <q-item>
            <q-item-section>
              <q-item-label>{{ summary.createdByUserName }}</q-item-label>
            </q-item-section>
            <q-item-section
              >{{ summary.fromDate }} - {{ summary.toDate }}</q-item-section
            >
            <q-item-section>{{ summary.status }}</q-item-section>
          </q-item>
          <q-separator inset></q-separator>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
