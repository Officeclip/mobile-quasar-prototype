<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMetaDetailsStore } from '../../../stores/MetaDetailsStore';
import MetaDetailsEditItem from 'src/components/Meta/Demo/MetaDetailsEditItem.vue';
import { MetaDetails } from 'src/models/Meta/metaDetails';

const contactDetails = ref<MetaDetails | undefined>();

const metaDetailsStore = useMetaDetailsStore();
const loadMetaDetails = async () => {
  await metaDetailsStore.getMetaDetailsDemo();
};
onMounted(async () => {
  await loadMetaDetails();
  const response = metaDetailsStore.MetaDetails;
  contactDetails.value = response;
});
</script>

<template>
  <!-- <pre>contactDetails::{{ contactDetails }}</pre> -->
  <q-card
    v-for="(section, index) in contactDetails?.sections"
    :key="index"
    flat
    bordered
    class="relative-position card-example"
  >
    <q-card-section class="q-pb-none">
      <div class="text-h6">{{ section.sectionName }}</div>
    </q-card-section>
    <q-card-section class="q-pb-none">
      <q-list>
        <q-item>
          <q-item-section class="rowItems align-content-left">
            <!-- From: https://stackoverflow.com/a/62785796/89256 -->
            <div v-for="(sectionEntry, i) in section.sectionEntries" :key="i">
              <MetaDetailsEditItem :params="sectionEntry" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
