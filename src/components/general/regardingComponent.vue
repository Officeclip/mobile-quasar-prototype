<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRegardingStore } from 'stores/regarding/regardingStore';
import { regardingItem } from 'src/models/general/regardingItem';

const regardingType = ref('');

const regardingStore = useRegardingStore();
regardingStore.getMetaTypes();

const metaTypeOptions = computed(() => {
  return regardingStore.MetaTypes;
});
//disabled regarding contacts unless select the option from regarding types

const disabled = computed(() => {
  return regardingType.value == '';
});

const regardingItems = ref([] as regardingItem[]);
const selectedRegItem = ref(null);

async function filterItems(
  val: string,
  update: (arg0: () => void) => void,
  abort: () => void
) {
  if (val.length < 2) {
    abort();
    return;
  } else if (val.length === 2) {
    regardingItems.value = [] as regardingItem[];
    await regardingStore.getRegardingItemsThatMatch(val, regardingType.value);
    regardingItems.value = regardingStore.regardingContacts;
  }

  update(() => {
    console.log('update');
    const needle = val.toLowerCase();
    regardingItems.value = regardingStore.regardingContacts.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

<template>
  <q-list>
    <q-item class="q-mt-none">
      <q-item-section class="q-mr-sm">
        <!-- <pre>{{ parentServiceType }}</pre> -->
        <q-select
          v-model="regardingType"
          :options="metaTypeOptions"
          dense
          emit-value
          label="Regarding"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-section>
      <q-item-section class="q-mr-sm">
        <q-select
          v-model="selectedRegItem"
          :disable="disabled"
          :option-disable="disabled"
          :options="regardingItems"
          dense
          multiple
          option-label="name"
          option-value="id"
          use-input
          @filter="filterItems"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
      <q-item-section side>
        <q-icon color="primary" name="switch_access_shortcut" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
