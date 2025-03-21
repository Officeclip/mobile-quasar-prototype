<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import drawer from '../../components/drawer.vue';
import { useTrackerBinderSummaryStore } from 'src/stores/issueTracker/trackerBinderSummaryStore';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import OC_Loader from 'src/components/general/OC_Loader.vue';

const router = useRouter();
const title = ref('Binders');
const myDrawer = ref();
const $q = useQuasar();
const loading = ref(true);

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
const trackerBinderSummaryStore = useTrackerBinderSummaryStore();

const loadBindersList = async () => {
  loading.value = true;
  try {
    await trackerBinderSummaryStore.getTrackerBindersList();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/homePage' });
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // trackerBinderSummaryStore.getTrackerBindersList();
  loadBindersList();
});
const binderList = computed(() => {
  return trackerBinderSummaryStore.TrackerBindersList;
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
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
        <q-toolbar-title> Issue Tracker </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <OC_Loader :visible="loading" />
        <div>
          <q-list>
            <q-item>
              <q-item-section class="text-h6 items-center">
                {{ title }}</q-item-section
              >
            </q-item>
            <q-separator spaced inset color="yellow-6"></q-separator>
          </q-list>
          <div v-if="binderList">
            <q-list v-for="binder in binderList" :key="binder.id">
              <q-item
                :to="{
                  name: 'trackerCaseSummary',
                  params: {
                    binderId: binder.id,
                    binderName: binder.name,
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
            </q-list>
          </div>
          <div v-else>
            <q-item>
              <q-item-section>
                <q-item-label class="text-subtitle2">
                  No Binders has been created yet please contact your Admin.
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style></style>
