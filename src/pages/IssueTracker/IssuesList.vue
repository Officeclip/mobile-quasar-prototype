<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import drawer from '../../components/drawer.vue';
import { useIssueTrackerStore } from 'src/stores/issueTracker/issueTrackerStore';
import { useRoute } from 'vue-router';

// const title = ref('Binders');

const route = useRoute();
const title = route.params.binder;
const myDrawer = ref();

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
const issueTrackerStore = useIssueTrackerStore();

onMounted(() => {
  issueTrackerStore.getIssuesList();
  // binderList.value = issueTrackerStore.BindersList;
});
const issuesList = computed(() => {
  return issueTrackerStore.IssuesList;
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          @click="$router.push({ path: '/binders' })"
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
        <q-toolbar-title> {{ title }} </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <!-- <q-list>
          <q-item>
            <q-item-section class="text-h6 items-center">
              {{ title }}</q-item-section
            >
          </q-item>
          <q-separator size=".15rem" color="red-3"></q-separator>
        </q-list> -->
        <q-list v-for="issue in issuesList" :key="issue.id">
          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label class="ellipsis"
                ><span class="text-subtitle1 text-weight-medium inline"
                  >{{ issue.id }}:</span
                >
                {{ issue.name }}</q-item-label
              >
              <q-item-label
                ><span class="text-caption">Created On:</span>
                <span class="q-mx-sm">{{
                  issue.createdDate
                }}</span></q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-chip dense outline>
                <q-item-label caption class="q-px-xs">{{
                  issue.status
                }}</q-item-label>
              </q-chip>
            </q-item-section>

            <q-item-section side>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
          <q-separator color="yellow-6"></q-separator>
        </q-list>
      </q-page>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="add" color="accent" padding="sm"> </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
@import '../../css/status.scss';
</style>
