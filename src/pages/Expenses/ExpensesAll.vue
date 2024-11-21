<script setup lang="ts">
import { ref, onMounted, computed, watch, capitalize } from 'vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';
import { isAllowed } from 'src/helpers/security';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import logger from 'src/helpers/logger';
import drawer from '../../components/drawer.vue';

const expensesDetailsStore = useExpenseDetailsStore();
const router = useRouter();
const $q = useQuasar();
const expenseStatus = ref('inbox');
const title = ref(capitalize(expenseStatus.value));

const myDrawer = ref();

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

const errorMsg = computed(() => {
  return expensesDetailsStore.errorMsg;
});

watch([expenseStatus], ([newModel]) => {
  expensesDetailsStore.getExpensesByStatus(String(newModel));
  title.value = capitalize(newModel);
});
const isAllow = isAllowed({ roleAccess: 'TimeExpensesCreateTimeSheet' });

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
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
          @click="router.push({ path: '/homepage' })"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title>{{ title }} Expenses </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
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
        <div v-if="allExpenses">
          <q-list v-for="expense in allExpenses" :key="expense.id">
            <q-item
              :to="{
                name: 'expenseDetails',
                params: {
                  id: expense.id,
                  employeeId: expense.employeeId,
                  fromDate: expense.fromDate,
                  toDate: expense.toDate,
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
                  {{ expense.totalAmount.toFixed(2) }}
                  <span class="text-caption q-pl-xs">{{
                    expense.currency
                  }}</span>
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
        </div>
        <div v-else>
          <div v-if="title === 'Inbox'">
            <q-list class="flex flex-center">
              <q-item>
                <q-item-section v-if="errorMsg !== ''">
                  <div class="flex justify-center">
                    <span
                      class="text-subtitle1 text-weight-medium inline q-mr-xs"
                      >{{ errorMsg }}</span
                    >
                  </div>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-h6 q-py-md">
                    Create your first expense
                  </q-item-label>
                  <q-item-label>
                    A expense is used to track cost incurred by an individual or
                    organization in order to achieve a specific goal or benefit.
                  </q-item-label>
                </q-item-section>
              </q-item></q-list
            >
          </div>
        </div>
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
