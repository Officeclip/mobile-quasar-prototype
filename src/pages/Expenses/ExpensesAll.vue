<script setup lang="ts">
import { ref, onMounted, computed, watch, capitalize } from 'vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';
import { isAllowed } from 'src/helpers/security';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const expensesDetailsStore = useExpenseDetailsStore();
const router = useRouter();
const $q = useQuasar();
const expenseStatus = ref('inbox');
const title = ref(capitalize(expenseStatus.value));

onMounted(async () => {
  try {
    await expensesDetailsStore.getExpensesByStatus(String(expenseStatus.value));
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
});

const allExpenses = computed(() => {
  return expensesDetailsStore.ExpenseSummary;
});

console.log(
  'allExpenses allExpenses allExpenses allExpenses',
  allExpenses.value
);

watch([expenseStatus], ([newModel]) => {
  expensesDetailsStore.getExpensesByStatus(String(newModel));
  title.value = capitalize(newModel);
});
const isAllow = isAllowed({ roleAccess: 'TimeExpensesCreateTimeSheet' });
</script>
<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar class="glossy">
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title>{{ title }} Expenses </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-footer elevated>
      <q-tabs
        v-model="expenseStatus"
        no-caps
        inline-label
        class="bg-primary text-white shadow-2"
        align="justify"
      >
        <q-tab name="inbox" label="Inbox" icon="inbox"> </q-tab>
        <q-tab name="outbox" label="Outbox" icon="outbox" />
        <q-tab name="archived" label="Archived" icon="archive" />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <q-page>
        <q-list v-for="expense in allExpenses" :key="expense.id">
          <!-- TODO: CR: 2024-05-17: nk: Fix the type error? -->
          <q-item
            :to="{
              name: 'expenseDetails',
              params: {
                id: expense.id,
                employeeId: expense.employeeId,
                fromDate: expense.fromDate,
                stageId: expense.stageId,
                status: expense.status,
              },
            }"
            clickable
            v-ripple
          >
            <q-item-section>
              <q-item-label>
                {{ expense.createdByUserName }}
              </q-item-label>
              <q-item-label caption>{{
                expense.fromDate
                  ? dateTimeHelper.extractDateFromUtc(expense.fromDate)
                  : 'No Specific Date'
              }}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ expense.totalAmount }}.00
                <span class="text-caption q-pl-xs">{{ expense.currency }}</span>
              </q-item-label>
            </q-item-section>
            <q-item-section style="align-items: end">
              <q-chip
                dense
                :class="getExpenseOrTimesheetStatusColor(expense.status)"
                ><q-item-label caption class="q-px-sm">{{
                  expense.status
                }}</q-item-label></q-chip
              >
            </q-item-section>
            <q-item-section side>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
        </q-list>
      </q-page>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          v-if="isAllow"
          :to="{
            name: 'newPeriodExpense',
          }"
          fab
          icon="add"
          color="accent"
          padding="sm"
        >
        </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
@import '../../css/status.scss';
</style>
<style lang="scss">
@import '../../css/status.scss';
</style>
