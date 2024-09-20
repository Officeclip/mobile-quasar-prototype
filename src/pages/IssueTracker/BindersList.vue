<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import drawer from '../../components/drawer.vue';
import { useIssueTrackerStore } from 'src/stores/issueTracker/issueTrackerStore';

const title = ref('Binders');
const myDrawer = ref();

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
const issueTrackerStore = useIssueTrackerStore();

onMounted(() => {
  issueTrackerStore.getBindersList();
  // binderList.value = issueTrackerStore.BindersList;
});
const binderList = computed(() => {
  return issueTrackerStore.BindersList;
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          @click="$router.push({ path: '/homepage' })"
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
        <q-toolbar-title> Issue Tracker </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <q-list>
          <q-item>
            <q-item-section class="text-h6 items-center">
              {{ title }}</q-item-section
            >
          </q-item>
          <q-separator spaced inset color="yellow-6"></q-separator>
        </q-list>
        <q-list v-for="binder in binderList" :key="binder.id">
          <q-item
            :to="{
              name: 'issuesList',
              params: {
                binder: binder.name,
              },
            }"
            clickable
            v-ripple
          >
            <q-item-section>
              <q-item-label
                >{{ binder.name }} ({{ binder.count }})</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
          <q-separator spaced inset></q-separator>
          <!-- <q-separator color="yellow-6"></q-separator> -->
        </q-list>
      </q-page>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="accent" padding="sm"> </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<style></style>
