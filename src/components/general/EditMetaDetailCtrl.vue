<script setup>
import { defineProps, ref, onMounted, computed } from 'vue';
import { useMetaListsStore } from 'src/stores/MetaListsStore';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();
const listsJson = ref(null);
const props = defineProps(['fromParentData']);
const metaDetails = ref(props?.fromParentData);

const metaListsStore = useMetaListsStore();

const loadMetaLists = async () => {
  try {
    await metaListsStore.getMetaLists_N();
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
  await loadMetaLists();
  listsJson.value = items.value;
});

const items = computed(() => {
  return metaListsStore.MetaLists_N;
});
const getOptions = (metaId) => {
  const list = listsJson.value?.find((item) => item.metaId === metaId);
  return list
    ? list.listItems.map((item) => ({ value: item.value, label: item.name }))
    : [];
};
</script>

<template>
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <div v-if="metaDetails">
          <!-- <pre>{{ metaDetails }}</pre> -->
          <!-- <pre>listsJson::{{ listsJson }}</pre> -->
          <q-card
            v-for="section in metaDetails.sections"
            :key="section.sectionId"
            class="q-mb-md"
          >
            <q-toolbar>
              <q-toolbar-title>{{ section.sectionName }}</q-toolbar-title>
            </q-toolbar>
            <q-separator />
            <div class="q-col-gutter-sm">
              <!-- display the items dynamically according to the visible property -->
              <q-list
                v-for="entry in section.sectionEntries.filter(
                  (e) => e.visible || section.sectionEntries[index - 1]?.visible
                )"
                :key="entry.metaId"
              >
                <q-item>
                  <q-item-section>
                    <template v-if="entry.type === 'select'">
                      <q-select
                        v-model="entry.value"
                        :label="entry.visibleName"
                        :options="getOptions(entry.metaId)"
                        :readonly="!entry.editable"
                        emit-value
                        map-options
                      ></q-select>
                    </template>
                    <template v-else>
                      <q-input
                        v-model="entry.value"
                        :label="entry.visibleName"
                        :type="entry.type"
                        :readonly="!entry.editable"
                      ></q-input>
                    </template>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>
