<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const expenseListsStore = useExpenseListsStore();
const router = useRouter();
const $q = useQuasar();

const periodModel: any = ref('');
const errorMsg: any = ref('');
const warningMsg: any = ref('');

const periodOptions = computed(() => {
  return expenseListsStore.PeriodList;
});

const toDaysDate = new Date().toISOString().split('T')[0];

const setModelValue = computed(() => {
  return periodOptions.value.find((option) => {
    const start = option.start.toString();
    const end = option.end.toString();
    return toDaysDate >= start && toDaysDate <= end;
  });
});
onMounted(async () => {
  try {
    await expenseListsStore.getExpensesList();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/expensesAll' });
    });
  }
  periodModel.value = setModelValue.value;
});

watch([periodModel], ([newPeriodModel]) => {
  errorMsg.value = newPeriodModel.error;
  warningMsg.value = newPeriodModel.warning;
});
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          @click="router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> New Expense</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-list>
          <q-item v-if="errorMsg || warningMsg">
            <p v-if="errorMsg" class="text-red">{{ errorMsg }}</p>
            <p v-if="warningMsg" class="text-orange">{{ warningMsg }}</p>
          </q-item>
          <q-item>
            <q-select
              class="full-width"
              label="Period"
              v-model="periodModel"
              :options="periodOptions"
              map-options
              option-label="name"
          /></q-item>
          <q-list>
            <q-btn
              v-if="periodModel != '' && errorMsg == ''"
              class="q-ml-md q-mb-md q-mt-md"
              label="Next"
              color="primary"
              :to="{
                name: 'newExpense',
                params: {
                  fromDate: periodModel?.start,
                  toDate: periodModel?.end,
                  expenseSid: '0',
                },
              }"
            ></q-btn> </q-list
        ></q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.error-message {
  color: red;
}
</style>
