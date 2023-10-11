<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { regardingContact } from '../../models/general/regardingAll';
import { useRegardingAllStore } from '../../stores/regarding/regardingAllStore';

const parentServiceType = ref('');

const regardingAllStore = useRegardingAllStore();
regardingAllStore.getMetaTypes();
const metaTypeOptions = computed(() => {
  return regardingAllStore.MetaTypes;
});

const regardingContacts = ref([] as regardingContact[]);
const selectedRegContact = ref(null);

async function filterContacts(
  val: string,
  update: (arg0: () => void) => void,
  abort: () => void
) {
  if (val.length < 2) {
    abort();
    return;
  } else if (val.length === 2) {
    regardingContacts.value = [] as regardingContact[];
    await regardingAllStore.getRegardingContactListThatMatch(val);
    regardingContacts.value = regardingAllStore.regardingContacts;
  }

  update(() => {
    console.log('update');
    const needle = val.toLowerCase();
    regardingContacts.value = regardingAllStore.regardingContacts.filter(
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
          label="Regardings"
          v-model="parentServiceType"
          :options="metaTypeOptions"
          dense
          option-label="name"
          option-value="id"
          emit-value
          map-options
        />
      </q-item-section>
      <q-item-section class="q-mr-sm">
        <q-select
          v-model="selectedRegContact"
          :options="regardingContacts"
          dense
          multiple
          option-label="name"
          option-value="id"
          use-input
          @filter="filterContacts"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
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
