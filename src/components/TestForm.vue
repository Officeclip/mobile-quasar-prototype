<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps(['expenseForm']);

const selectedItem = ref('Yes');

const billableOptions = ref([]);
billableOptions.value = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];

const newValue = ref('');
newValue.value = expenseTypes.value.isBillable;

const expenseTypes = ref([]);
expenseTypes.value = [
  {
    id: 'J2BBXASXHAFW2ZSD2BKNWBGEB2LYYHFSGMJM6LQ',
    expenseTypeName: 'AIRFARE',
    expenseName: 'Air',
    isDetailsRequired: true,
    isBillable: false,
    isBillableModify: false,
  },

  // {
  //   id: 'D6JQ2UJFFMFCW8YXZBTUNCDF5DNE6QGCYJJM6LQ',
  //   expenseTypeName: 'AUTORENTAL',
  //   expenseName: 'Auto Rental',
  //   isDetailsRequired: true,
  //   isBillable: true,
  //   isBillableModify: true
  // }
];

console.log('Testing IsBillableModify', expenseTypes.value.isBillableModify);
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <!-- <pre> {{ expenseForm.description }} </pre> -->
        <!-- <q-input label="Description" v-model="expenseForm.description" placeholder="enter here..." lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']">
        </q-input> -->
        <!-- <q-select filled v-model="selectedItem" :options="billableOptions" label="Is Billable" emit-value map-options
          :disable="false" /> -->
        <q-toggle
          v-if="isBillableModify === true"
          label="labelName"
          :false-value="false"
          :true-value="true"
          color="primary"
          keep-color
          v-model="newValue"
        ></q-toggle>
        <div v-else caption class="q-mb-md text-italic">
          <q-item-label class="q-mb-sm">
            {{ newValue }}
          </q-item-label>
          <q-icon name="hide_source" /> You do not permission to edit this item
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
