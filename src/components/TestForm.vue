<script lang="ts" setup>
console.log('TestForm.vue > setup - started');
import { computed, onMounted, ref } from 'vue';
import { useExpenseListsStore } from '../stores/expense/expenseListsStore';
import {
  customerProject,
  period,
  expenseType,
  paymentType,
} from '../models/expense/expenseLists';

const expenseListsStore = useExpenseListsStore();

const props = defineProps(['expenseForm']);
const newValue = ref(null);

const getBillableModify = computed(() => {
  const expenseTypeStr = props.expenseForm?.expenseTypeName;
  console.log(
    `TestForm > getIsBillableModify - expenseTypeStr: ${expenseTypeStr}`
  );
  const expenseTypes: expenseType[] = expenseListsStore.expenseTypes;
  console.log(`TestForm > getIsBillableModify - expenseTypes: ${expenseTypes}`);

  const expenseType = expenseTypes.filter((t) => {
    return t.expenseTypeName == expenseTypeStr;
  });
  console.log(
    `TestForm > getIsBillableModify - expenseType[0]: ${expenseType[0]}`
  );
  return expenseType[0].isBillableModify;
});

onMounted(() => {
  console.log('TestForm.vue > onMounted - started');
  expenseListsStore.getExpensesList();
  console.log('TestForm.vue > onMounted - ended');
});
console.log('TestForm.vue > setup - ended');
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <pre> {{ props.expenseForm }} </pre>
        <!-- <pre>{{ getBillableModify }}</pre> -->
        <!-- <q-toggle
          v-if="getBillableModify"
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
        </div> -->
      </div>
    </div>
  </div>
</template>
<style></style>
