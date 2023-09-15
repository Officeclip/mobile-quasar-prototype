<template>
  <div>
    <div class="q-chips row">
      <q-chip
        v-for="(item, index) in selectedOptions"
        :key="index"
        removable
        @remove="removeSelectedOption(index)"
        dense
        outline
        color="primary"
        text-color="white"
        class="q-mb-md"
      >
        {{ item.label }}
      </q-chip>
    </div>

    <div class="q-mb-md">
      <q-input
        v-model="newOption"
        @keyup.enter="addNewOption"
        dense
        outlined
        placeholder="Add new option"
      />
    </div>

    <q-select
      v-model="selectedOption"
      :options="options"
      use-input
      clearable
      outlined
      filter
      emit-value
      map-options
      option-value="value"
      option-label="label"
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
  name: 'QSelectWithSearchAndAdd',
  setup() {
    const selectedOptions = ref([]);
    const newOption = ref('');
    const selectedOption = ref(null);
    const options = ref([
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry' },
      { value: 'date', label: 'Date' },
      { value: 'grape', label: 'Grape' },
      { value: 'kiwi', label: 'Kiwi' },
      { value: 'lemon', label: 'Lemon' },
    ]);

    const handleInput = (val) => {
      if (val.trim() !== '') {
        // Check if the entered value already exists in options
        if (!options.value.some((opt) => opt.label === val)) {
          // If not, set it as a selected option
          selectedOption.value = val;
        } else {
          // If it exists, set the selected option to the existing one
          selectedOption.value = val;
        }
      } else {
        selectedOption.value = null; // Clear selected option when input is empty
      }
    };

    const addNewOption = () => {
      const value = newOption.value.trim();
      if (value !== '') {
        // Check if the entered value already exists in options
        if (!options.value.some((opt) => opt.label === value)) {
          // If not, add it to the options and selectedOptions
          options.value.push({ value, label: value });
          selectedOptions.value.push({ value, label: value });
          newOption.value = '';
        } else {
          // If it exists, select it
          selectedOption.value = value;
        }
      }
    };

    const removeSelectedOption = (index) => {
      selectedOptions.value.splice(index, 1);
    };

    return {
      selectedOptions,
      newOption,
      selectedOption,
      options,
      handleInput,
      addNewOption,
      removeSelectedOption,
    };
  },
};
</script>

<style scoped>
.q-chips.row {
  flex-wrap: wrap;
}
</style>
