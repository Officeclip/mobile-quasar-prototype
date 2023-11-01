<script setup lang="ts">
import { useExpenseSummaryStore } from '../../stores/expense/expenseSummaryStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const id = ref<string | string[]>('0');
const status = ref<string | string[]>('');
const expensesStore = useExpenseSummaryStore();

onMounted(() => {
  const route = useRoute();
  console.log('id=', route.params.id);
  console.log('status=', route.params.status);
  id.value = route.params.id;
  status.value = route.params.status;
  expensesStore.getExpenseSummaryByStatus(String(route.params.status));
});

const getExpenses = computed(() => {
  return expensesStore.ExpenseSummary;
});
</script>
<template>
  <q-list v-for="expense in getExpenses" :key="expense.id">
    <q-item :to="{
      name: 'expenseDetails',
      params: {
        id: expense.id,
      },
    }" clickable v-ripple>
      <q-item-section>
        <q-item-label>
          {{ expense.createdByUserName }}
        </q-item-label>
        <q-item-label caption>{{
          expense.fromDate
          ? dateTimeHelper.extractMonthFromUtc(expense.fromDate)
          : 'NoData msg'
        }}
          - {{ expense.totalAmount }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon color="primary" name="chevron_right" />
      </q-item-section>
    </q-item>
    <q-separator></q-separator>
  </q-list>
</template>

<style scoped>
.q-router-link--active {
  color: black;
}

.q-list:nth-child(odd) {
  background: rgb(238, 238, 238);
}
</style>
