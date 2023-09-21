<template>
  <q-select
    filled
    v-model="model"
    use-input
    use-chips
    multiple
    input-debounce="0"
    @new-value="createValue"
    :options="filterOptions"
    @filter="filterFn"
    style="width: 250px"
  ></q-select>
</template>

<script setup>
import { ref } from 'vue';
// const options = ref([
//   {
//     id: 1,
//     name: 'SK Dutta',
//     email: 'skd@officeclip.com',
//   },
//   {
//     id: 2,
//     name: 'Nagesh Kulkarni',
//     email: 'nagesh@officeclip.com',
//   },
//   {
//     id: 3,
//     name: 'Sudhakar Gundu',
//     email: 'sudhakar@officeclip.com',
//   },
// ]);
const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'];
const filterOptions = ref(stringOptions);
// const filterOptions = ref(options);

const model = ref(null);

function filterFn(val, update) {
  // Filter the options array based on the search value.
  update(() => {
    if (val === '') {
      filterOptions.value = stringOptions;
    } else {
      const needle = val.toLowerCase();
      filterOptions.value = stringOptions.filter(
        (v) => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

function createValue(val, done) {
  // Add the new item to the options array.
  if (val.length > 0) {
    if (!stringOptions.includes(val)) {
      stringOptions.push(val);
    }
    done(val, 'toggle');
  }
}
</script>
