<script setup lang="ts">
import { ref, onMounted, computed, watch, capitalize, nextTick } from 'vue';
import { useExpenseSummaryStore } from '../../stores/expense/expenseSummaryStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';
import { isAllowed } from 'src/helpers/security';
import { QInfiniteScroll, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import drawer from '../../components/drawer.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';

const expensesDetailsStore = useExpenseSummaryStore();

const $q = useQuasar();
const router = useRouter();

const tab = ref(expensesDetailsStore.selectedTab);
const title = ref(capitalize(tab.value));
const loading = ref(false); // <-- Change this from 'true' to 'false'
let reachedEnd = ref(false);
const myDrawer = ref();
const infiniteScrollRef = ref<QInfiniteScroll | null>(null); // <-- Add ref for the component

// --- Computed Properties ---
const allExpenses = computed(() => expensesDetailsStore.ExpenseSummary);
const errorMsg = computed(() => expensesDetailsStore.errorMsg);

const loadMore = async (index: number, done: () => void) => {
  loading.value = true;
  try {
    // Fetch more timesheets for the current tab
    reachedEnd.value = await expensesDetailsStore.fetchMoreExpenseSummaries(
      tab.value,
    );
    if (reachedEnd.value) {
      infiniteScrollRef.value?.stop(); // Stop infinite scroll if all data is loaded
    }
    done();
  } catch (error) {
    reachedEnd.value = true; // Stop on error
    done();
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  } finally {
    loading.value = false;
  }
};

// --- Watcher ---
// This is the key fix: watching the tab to reset state and trigger a new load.
watch(tab, async (newTab) => {
  expensesDetailsStore.selectedTab = newTab;
  title.value = capitalize(newTab); // 1. Reset the store's list and pagination state

  await expensesDetailsStore.resetExpenses(); // 2. Reset the component's own "end reached" flag

  reachedEnd.value = false; // 3. Reset the q-infinite-scroll and EXPLICITLY trigger a new load.

  // Simply calling .reset() is not reliably triggering the load in this scenario.
  // Calling .trigger() right after ensures the fetch for the new tab happens.
  if (infiniteScrollRef.value) {
    infiniteScrollRef.value.reset();
    infiniteScrollRef.value.trigger();
  }
});

onMounted(async () => {
  // await loadExpensesByStatus();
  await expensesDetailsStore.resetExpenses();
  await nextTick();
  // explicitly trigger the infinite scroll to fetch the first page.
  if (infiniteScrollRef.value) {
    infiniteScrollRef.value.trigger();
  }
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
      <q-toolbar>
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
        v-model="tab"
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
        <div v-if="errorMsg !== ''">
          <q-list class="flex flex-center">
            <q-item v-if="title === 'Inbox'">
              <q-item-section>
                <q-item-label class="text-h6 q-py-md">
                  {{ errorMsg }}
                </q-item-label>
                <q-item-label class="text-h6 q-py-sm">
                  Create your first Expense
                </q-item-label>
                <q-item-label>
                  An Expense report is used to track employee's expenses on
                  projects and tasks.
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-else>
              <q-item-section>
                <q-item-label class="text-h6 q-py-md">
                  {{ errorMsg }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <OC_Loader :visible="loading" />
        <q-infinite-scroll
          ref="infiniteScrollRef"
          :disable="reachedEnd"
          @load="loadMore"
        >
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
                    ? dateTimeHelper.formatDateForTE(expense.fromDate)
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
            <q-separator></q-separator> </q-list
        ></q-infinite-scroll>
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
          padding="md"
        >
        </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
@import '../../css/status.scss';
</style>
