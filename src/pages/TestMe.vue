<script setup>
import { computed, onMounted } from 'vue';
import { useMetaDetailsStore } from 'src/stores/MetaDetailsStore';
import { useRouter } from 'vue-router';
// import BackButton from 'src/components/OCcomponents/Back-Button.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

const router = useRouter();
const store = useMetaDetailsStore();

const loadMetaDetails = async () => {
  await store.getMetaDetailsDemo();
};
onMounted(async () => {
  await loadMetaDetails();
});

// Provide a default object to avoid undefined errors
const metaDetails = computed(() => store.MetaDetails || { sections: [] });

// Filter sections and entries by visible
const visibleSections = computed(() => {
  if (!metaDetails.value?.sections) return [];
  return metaDetails.value.sections
    .map((section) => ({
      ...section,
      sectionEntries: section.sectionEntries.filter(
        (entry) =>
          entry.visible &&
          entry.value !== '' &&
          entry.value !== '-1' &&
          entry.visibleName !== 'id' &&
          entry.visibleName !== 'group_id',
      ),
    }))
    .filter((section) => section.sectionEntries.length > 0);
});

const onEdit = () => {
  router.push({
    name: 'EditMetaDetail',
    params: { contactId: metaDetails.value.id },
  });
};
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <BackButton />
        <q-toolbar-title> Contact Details </q-toolbar-title>
        <q-btn flat round dense color="white" icon="edit" @click="onEdit()">
        </q-btn>
      </q-toolbar>
    </q-header> -->
    <OC_Header
      title="Contact Meta Details"
      :show-back="true"
      :show-edit-button="true"
      @edit="onEdit"
    ></OC_Header>

    <q-page-container>
      <q-page class="q-pa-md">
        <q-card
          v-for="section in visibleSections"
          :key="section.id"
          class="q-mb-md"
        >
          <q-card-section>
            <div class="text-h6">{{ section.sectionName }}</div>
          </q-card-section>
          <q-separator />
          <q-list bordered>
            <div v-for="entry in section.sectionEntries" :key="entry.id">
              <q-item>
                <q-item-section>
                  <div class="text-caption text-grey-7">
                    {{ entry.visibleName }}
                  </div>
                  <div class="text-subtitle1">{{ entry.value }}</div>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </q-card>
        <div
          v-if="visibleSections.length === 0"
          class="text-center text-grey q-mt-xl"
        >
          No sections to display.
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
