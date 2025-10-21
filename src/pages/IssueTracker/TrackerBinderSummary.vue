<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import drawer from '../../components/drawer.vue';
import { useTrackerBinderSummaryStore } from 'src/stores/issueTracker/trackerBinderSummaryStore';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

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
    <OC_Header
      title="Issue Tracker"
      back-button-to="/homepage"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
    />
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
            <q-separator spaced inset></q-separator>
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
          <div
            v-else
            class="items-center column"
            style="
              position: absolute;
              top: 40%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
              z-index: 10;
            "
          >
            <q-icon name="error_outline" size="100px" color="grey-5" />
            <!-- <div class="text-h6 q-mt-sm q-py-md">{{ errorMsg }}</div> -->

            <div class="text-center">
              <div class="text-body1 text-grey-7">
                No Binders has been created yet please contact your Admin.
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style></style>
