<script setup>
import { onMounted, ref, computed } from 'vue';
// import { useMetaContactDetailsStore } from 'src/stores/contact/ContactTestDetails.ts';
import { useMetaDetailsStore } from 'src/stores/MetaDetailsStore';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const jsonData = ref(null);
// const metaContactDetails = useMetaContactDetailsStore();
const metaContactDetails = useMetaDetailsStore();

const toggleMetaDetails = ref('show more');

const loadDetails = async () => {
  try {
    await metaContactDetails.getMetaDetail_N();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error,
    }).onOk(() => {
      router.go(-1);
    });
  }
};

onMounted(async () => {
  await loadDetails();
  jsonData.value = items.value[0];
});

const items = computed(() => {
  return metaContactDetails.MetaDetails_N;
});

const editMetaDetails = async () => {
  await router.push({
    path: '/editMetaData',
  });
};
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn flat round dense color="white" icon="arrow_back"> </q-btn>
        <q-toolbar-title>Test program</q-toolbar-title>
        <q-btn flat icon="edit" round @click="editMetaDetails"> </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page v-if="jsonData">
        <q-item>
          <q-item-section>
            <q-toggle
              v-model="toggleMetaDetails"
              color="primary"
              keep-color
              false-value="show more"
              true-value="show less"
              :label="toggleMetaDetails"
            ></q-toggle>
          </q-item-section>
        </q-item>
        <div v-if="toggleMetaDetails === 'show less'">
          <q-card
            v-for="section in jsonData.sections"
            :key="section.sectionId"
            class="q-mb-md"
          >
            <q-toolbar>
              <q-toolbar-title>{{ section.sectionName }}</q-toolbar-title>
            </q-toolbar>
            <q-separator />
            <div class="row q-col-gutter-sm">
              <!-- display the items dynamically according to the visible property -->
              <q-list
                v-for="entry in section.sectionEntries.filter(
                  (e) => e.visible || section.sectionEntries[index - 1]?.visible
                )"
                :key="entry.metaId"
                class="col-6"
              >
                <q-item>
                  <q-item-section>
                    <q-item-label caption
                      >{{ entry.visibleName }}:
                    </q-item-label>
                    <q-item-label class="wrap-text">
                      {{ entry.value }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.wrap-text {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}
</style>
