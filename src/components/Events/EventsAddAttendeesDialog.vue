<script lang="ts" setup>
import { ref } from 'vue';

const selectedItems = ref([]);
const options = ref(['Option 1', 'Option 2', 'Option 3']);

function addNewItem(value: string) {
  if (!options.value.includes(value)) {
    options.value.push(value);
  }

  selectedItems.value.push(value);
}

function removeItem(item: any) {
  const index = selectedItems.value.indexOf(item);
  selectedItems.value.splice(index, 1);
}
</script>

<template>
  <q-card>
    <div class="q-pa-lg row flex-center">
      <form>
        <q-select
          v-model="selectedItems"
          :options="options"
          multiple
          use-input
          use-chips
          @new-value="addNewItem"
          @remove="removeItem"
          name="selected_items"
          label="Add Attendees"
        />
        <q-btn
          class="q-mt-md"
          v-close-popup
          color="primary"
          label="Save"
          type="submit"
          no-caps
        />
      </form>
    </div>
    <!-- <q-card-actions>
      <q-btn v-close-popup color="primary" label="Save" />
    </q-card-actions> -->
  </q-card>
</template>

<style scoped>
.min-width {
  min-width: 250px;
}
</style>
