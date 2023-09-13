<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useExpensesStore } from '../../stores/ExpensesStore';
import { useRoute } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';

const expensesStore = useExpensesStore();

onMounted(() => {
  const route = useRoute();
  expensesStore.getExpenseDetails(Number(route.params.id))
});

const expenseDetails = computed(() => {
  return expensesStore.ExpenseDetails
});

</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title> Expense details </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="q-ma-sm">
      <q-list v-for="expenseDetail in expenseDetails" :key="expenseDetail.id" class="rounded-borders q-my-md bg-grey-3">
        <q-expansion-item expand-separator expand-icon-class="text-primary">
          <template v-slot:header>
            <q-item-section>
              <q-item-label>
                {{ expenseDetail.accountName }}
              </q-item-label>
              <q-item-label caption>
                {{ expenseDetail.expenseDate ? dateTimeHelper.extractDateFromUtc(expenseDetail.expenseDate) :
                  'No Specific Date' }}
              </q-item-label>
            </q-item-section>

            <q-item-section side flex>
              <q-item-label caption>
                {{ expenseDetail.amount }} hrs

                <q-btn :to="{
                  name: 'editExpense',
                  params: {
                    id: expenseDetail?.id,
                  },
                }" size="sm" flat round dense icon="edit" class="q-ml-sm">
                </q-btn>
              </q-item-label>
            </q-item-section>
          </template>
          <!-- <q-separator></q-separator> -->
          <q-item-section class="q-ma-md">

            <q-item-label caption>
              Project
            </q-item-label>
            <q-item-label class="q-mb-sm">
              {{ expenseDetail.projectName }}
            </q-item-label>

            <q-item-label caption>
              Billable
            </q-item-label>
            <q-item-label class="q-mb-sm">
              {{ expenseDetail.billable ? 'Yes' : 'No' }}
            </q-item-label>

            <q-item-label caption>
              Description
            </q-item-label>
            <q-item-label>
              {{ expenseDetail.description }}
            </q-item-label>
          </q-item-section>
          <q-item-section side flex>
            <q-item-label>
              <q-btn @click="expensesStore.deleteExpense(expenseDetail?.id); $router.go(-1)" size="sm" flat round dense
                icon="delete" class="q-mr-sm q-mb-sm"></q-btn>
            </q-item-label>
          </q-item-section>
        </q-expansion-item>
      </q-list>
    </q-page-container>
  </q-layout>
</template>

<style></style>
