<script setup>
import { ref } from 'vue';
const model = ref('1');
const labelOptions = [
  {
    id: '1',
    name: 'Office',
    color: '#FFCCCC',
  },
  {
    id: '2',
    name: 'Home',
    color: '#CCFFCC',
  },
];
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-list>
        <q-select
          v-model="model"
          :options="labelOptions"
          emit-value
          label="Label"
          map-options
          name="label"
          option-label="name"
          option-value="id"
        >
          <template #option="scope">
            <q-item
              class="q-my-xs"
              v-bind="scope.itemProps"
              v-bind:style="{ backgroundColor: scope.opt.color }"
            >
              <q-item-section>
                <q-item-label>
                  {{ scope.opt.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template #selected-item="scope">
            <q-item dense v-bind:style="{ backgroundColor: scope.opt.color }">
              {{ scope.opt.name }}
            </q-item>
          </template>
        </q-select>
      </q-list>
    </div>
  </div>
</template>
<style></style>
