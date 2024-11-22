<script setup lang="ts">
logger.log('Components/EditContactDetails: Setup');
import { onMounted, computed } from 'vue';
import { useMetaDetailsStore } from '../../stores/MetaDetailsStore';
import MetaDetailsEditItem from '../../components/Meta/MetaDetailsEditItem.vue';
import { useRoute } from 'vue-router';
import logger from 'src/helpers/logger';
const metaDetailsStore = useMetaDetailsStore();
const route = useRoute();
const contactDetails = computed(() => {
  return metaDetailsStore.MetaDetails;
});

onMounted(() => {
  metaDetailsStore.getMetaDetail(Number(route.params.id), false);
});
</script>

<template>
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
