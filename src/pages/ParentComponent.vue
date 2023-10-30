<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar class="glossy">
        <q-toolbar-title>Sample Data </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-footer elevated>
      <q-tabs v-model="model" class="bg-grey-9" align="justify">
        <q-tab name="Inbox" label="Inbox" icon="inbox" class="text-orange">
          <!-- Conditionally display the badge based on newItemsCount -->
          <q-badge color="red" floating v-if="newItemsCount > 0">{{
            newItemsCount
          }}</q-badge>
        </q-tab>
        <q-tab name="Outbox" label="Outbox" icon="outbox" class="text-cyan" />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <q-page>
        <div v-if="model == 'Inbox'">
          <q-list v-for="item in Items" :key="item.id">
            <q-item clickable v-ripple>
              <q-item-section>
                <q-item-label>
                  {{ item.name }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon color="primary" name="chevron_right" />
              </q-item-section>
            </q-item>
            <q-separator></q-separator>
          </q-list>
          <q-btn @click="addNewItem">Add New Item</q-btn>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const model = ref('Inbox');
const Items = [
  { id: '1', name: 'Sample1' },
  { id: '2', name: 'Sample2' },
  { id: '3', name: 'Sample3' },
  { id: '4', name: 'Sample4' },
];

const newItemsCount = ref(0);

const addNewItem = () => {
  const newItemId = (Items.length + 1).toString();
  Items.push({ id: newItemId, name: `New Item ${newItemId}` });
  newItemsCount.value += 1;
};

// Watch for changes in the 'model' variable
watch(model, (newValue, oldValue) => {
  if (newValue === 'Inbox') {
    // Reset the newItemsCount to 0 when the "Inbox" tab is activated
    newItemsCount.value = 0;
  }
});
</script>
