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
          style="width: 250px; padding-bottom: 32px"
          use-input
          @filter="filterFn"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <pre>{{ shownOptions }}</pre>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useEventListsStore} from "stores/event/eventListsStore";

const eventListsStore = useEventListsStore();
const options = []
for (let i = 0; i <= 10000; i++) {
  options.push('Option ' + i)
}
const shownOptions = ref([]);
const model = ref(null);

onMounted(() => {
  eventListsStore.getEventLists();
})


async function filterFn(val, update, abort) {
  if (val.length < 2) {
    abort()
    return
  } else if (val.length === 2) {
    shownOptions.value = [];
    // await new Promise(r => setTimeout(r, 2000));
    const contactsFromStore = eventListsStore.getRegardingContactList(val);
    console.log("contacts received from store", contactsFromStore);

    for (const contact of contactsFromStore) {
      shownOptions.value.push(contact);
    }
    console.log("contacts received from shownOptions", shownOptions.value);
  }

  update(() => {
    const needle = val.toLowerCase()
    shownOptions.value = options.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
}
</script>
