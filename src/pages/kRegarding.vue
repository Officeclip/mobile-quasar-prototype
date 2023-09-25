<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row">
      <q-select
        v-model="model"
        :options="shownOptions"
        fill-input
        filled
        hide-selected
        hint="Minimum 2 characters to trigger filtering"
        input-debounce="0"
        option-label="name"
        option-value="id"
        style="width: 250px; padding-bottom: 32px"
        use-input
        @filter="filterFn"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results</q-item-section>
          </q-item>
        </template>
      </q-select>
      <div>
        <q-item-label>Options displayed after filtering</q-item-label>
        <pre>{{ shownOptions }}</pre>
      </div>
      <div>
        <q-item-label>Data loaded in store</q-item-label>
        <pre>{{ eventListsStore.regardingContacts }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useEventListsStore} from 'stores/event/eventListsStore';

const eventListsStore = useEventListsStore();
const shownOptions = ref([]);
const model = ref(null);

onMounted(() => {
  // eventListsStore.getEventLists();
});

async function filterFn(val, update, abort) {
  if (val.length < 2) {
    abort();
    return;
  } else if (val.length === 2) {
    shownOptions.value = [];
    await eventListsStore.getRegardingContactListThatMatch(val);
    shownOptions.value = eventListsStore.regardingContacts;
  }

  update(() => {
    console.log('update');
    const needle = val.toLowerCase();
    shownOptions.value = eventListsStore.regardingContacts.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>
