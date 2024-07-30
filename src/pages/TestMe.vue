<script setup>
import { ref, computed } from 'vue';

const options = ref([
  {
    id: '684EHRFDNJ8CHAGVJC5Q',
    name: 'Sample One',
    email: 'testmail1@gmail.com',
  },
  {
    id: 'NJ9MYHSFZB9RHHHFFC5Q',
    name: 'Sample Two',
    email: 'testmail2@gmail.com',
  },
  {
    id: 'U6BCWDSF266ESD9R545Q',
    name: 'Sample Three',
    email: 'testmail3@gmail.com',
  },
]);

const createdUser = { createdUserSid: '684EHRFDNJ8CHAGVJC5Q' };

const initialValue = ref({
  id: '684EHRFDNJ8CHAGVJC5Q',
  name: 'Sample One',
  email: 'testmail1@gmail.com',
});

const selectedOptions = ref([initialValue.value]);

const canBeRemoved = computed(
  () => (item) => item.id !== createdUser.createdUserSid
);

function handleRemove(item) {
  if (canBeRemoved.value(item)) {
    const index = selectedOptions.value.findIndex(
      (option) => option.id === item.id
    );
    if (index !== -1) {
      selectedOptions.value.splice(index, 1);
    }
  }
}
</script>

<template>
  <q-select
    v-model="selectedOptions"
    :options="options"
    class="full-width"
    input-debounce="0"
    label="Attendees"
    multiple
    option-label="email"
    option-value="id"
    style="min-width: 250px"
    use-input
  >
    <template v-slot:selected-item="scope">
      <q-chip
        removable
        dense
        @remove="handleRemove(scope.opt)"
        :tabindex="scope.tabindex"
        text-color="secondary"
        class="q-ma-none"
      >
        {{ scope.opt.name }}
      </q-chip>
    </template>
  </q-select>
</template>
