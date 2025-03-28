<script setup>
import { onMounted, ref, computed } from 'vue';
import { useMetaContactDetailsStore } from 'src/stores/contact/ContactTestDetails.ts';
import { useRouter } from 'vue-router';

const router = useRouter();
const jsonData = ref(null);
const metaContactStore = useMetaContactDetailsStore();

const loadDetails = async () => {
  try {
    await metaContactStore.getContactDetails();
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
  // metaContactStore.getContactDetails();
  jsonData.value = items.value[0];
});

// const items = metaContactStore.ContactDetails;
const items = computed(() => {
  return metaContactStore.ContactDetails;
});
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn flat round dense color="white" icon="arrow_back"> </q-btn>
        <q-toolbar-title>Test program</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page v-if="jsonData">
        <q-card
          v-for="section in jsonData.sections"
          :key="section.sectionId"
          class="q-mb-md"
        >
          <q-card-section>
            <q-toolbar>
              <q-toolbar-title>{{ section.sectionName }}</q-toolbar-title>
            </q-toolbar>
          </q-card-section>
          <q-separator />
          <div class="row q-col-gutter-md">
            <q-card-section
              v-for="entry in section.sectionEntries"
              :key="entry.metaId"
              class="col-6"
            >
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label
                      ><strong>{{ entry.visibleName }}:</strong>
                      {{ entry.value }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </div>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
