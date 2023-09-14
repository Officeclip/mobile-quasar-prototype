<template>
  <div>
    <pre>{{ selectedOptions }}</pre>
    <q-select
      v-model="selectedOptions"
      :options="filteredOptions"
      input-debounce="0"
      use-input
      clearable
      outlined
      multiple
      emit-value
      map-options
      option-value="value"
      option-label="label"
      filter
      filter-method="customFilter"
      @input="handleInput"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey q-mb-md">
            No matching options
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'DropdownWithSearchAndAdd',
  setup() {
    const selectedOptions = ref([]);
    const options = ref([
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'date', label: 'Date' },
      { value: 'grape', label: 'Grape' },
      { value: 'kiwi', label: 'Kiwi' },
      { value: 'lemon', label: 'Lemon' },
    ]);

    const customFilter = (option, label, search) => {
      return (
        option.label.toLowerCase().includes(search.toLowerCase()) ||
        option.value.toLowerCase().includes(search.toLowerCase())
      );
    };

    const handleInput = (val) => {
      if (val.trim() !== '') {
        // Check if the entered value already exists in selectedOptions
        if (!selectedOptions.value.includes(val)) {
          selectedOptions.value.push(val);
        }
      }
    };
    const filteredOptions = ref(options.value);

    return {
      selectedOptions,
      options,
      customFilter,
      handleInput,
      filteredOptions,
    };
  },
};
</script>
