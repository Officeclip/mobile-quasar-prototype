<template>
  <form>
    <q-select
      v-model='selectedItems'
      :options="options"
      multiple
      use-input
      use-chips
      @new-value="addNewItem"
      @remove="removeItem"
      name="selected_items"
    />

    <q-btn type="submit">Submit</q-btn>
  </form>
</template>

<script setup>
import { ref, defineComponent } from 'vue';

const selectedItems = ref([]);
const options = ref(['Option 1', 'Option 2', 'Option 3']);

function addNewItem(value) {
  if (!options.value.includes(value)) {
    options.value.push(value);
  }

  selectedItems.value.push(value);
}

function removeItem(item) {
  const index = selectedItems.value.indexOf(item);
  selectedItems.value.splice(index, 1);
}

defineComponent({
  selectedItems,
  options,
  addNewItem,
  removeItem,
});
</script>
