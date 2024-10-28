<script lang="ts" setup>
import { searchFilter } from 'src/models/issueTracker/searchFilter';
import { ref } from 'vue';

const emit = defineEmits(['advancedOptionsGenerated', 'filterCount']);
const props = defineProps<{
  // parent: any;
  filterOptions: searchFilter;
}>();

const filterModel = ref(null);
// const filterOptions = ['Open', 'Closed', 'Resolved', 'Reopened'];
</script>

<template>
  <q-card style="width: 700px; max-width: 80vw">
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6">Filter Options</div>
      <q-space></q-space>
      <q-btn icon="close" flat round dense v-close-popup></q-btn>
    </q-card-section>

    <q-card-section>
      <q-item>
        <q-item-section>
          <q-item-label caption> Status: </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-select
              dense
              filled
              v-model="filterModel"
              :options="filterOptions"
            ></q-select>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label caption> Severity: </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-select
              dense
              filled
              v-model="filterModel"
              :options="filterOptions"
            ></q-select
          ></q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label caption> Category: </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-select
              dense
              filled
              v-model="filterModel"
              :options="filterOptions"
            ></q-select>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label caption> Created by: </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-select
              dense
              filled
              v-model="filterModel"
              :options="filterOptions"
            ></q-select>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-item-label caption> Modified by: </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-select
              dense
              filled
              v-model="filterModel"
              :options="filterOptions"
            ></q-select>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>
