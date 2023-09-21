<template>
  <q-card>
    <div class="q-pa-lg row flex-center">
      <q-select
        filled
        v-model="selectedAttendees"
        use-input
        use-chips
        multiple
        input-debounce="0"
        @new-value="createValue"
        :options="filterOptions"
        option-label="name"
        option-value="id"
        @filter="filterFn"
        label="Add Attendees"
        style="min-width: 250px"
      ></q-select>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';
const options = [
  {
    id: 1,
    name: 'SK Dutta',
    email: 'skd@officeclip.com',
  },
  {
    id: 2,
    name: 'Nagesh Kulkarni',
    email: 'nagesh@officeclip.com',
  },
  {
    id: 3,
    name: 'Sudhakar Gundu',
    email: 'sudhakar@officeclip.com',
  },
];
const filterOptions = ref(options);
const selectedAttendees = ref(null);

function filterFn(val, update) {
  // Filter the options array based on the search value.
  update(() => {
    if (val === '') {
      filterOptions.value = options;
    } else {
      const needle = val.toLowerCase();
      filterOptions.value = options.filter(
        (v) => v.name.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

function createValue(val, done) {
  // create a new id value to add the id property for the new input string from user
  const id = Math.round(Math.random() * 10);
  // Add the new item to the options array.
  if (val.length > 0) {
    if (!options.includes(val)) {
      options.push({ id: id, name: val }); // push the new item as an object into the list
    }
    done({ id: id, name: val }, 'toggle'); // added the new input as an new item into the dropdown
  }
}
</script>
