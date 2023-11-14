<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';
import { useRoute } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import autoRentalExpense from '../../components/expenses/details/autoRentalExpense.vue';
import airTravelExpense from '../../components/expenses/details/airTravelExpense.vue';
import hotelExpense from '../../components/expenses/details/hotelExpense.vue';
import mileageExpense from '../../components/expenses/details/mileageExpense.vue';
import taxiExpense from '../../components/expenses/details/taxiExpense.vue';
import telephoneExpense from '../../components/expenses/details/telephoneExpense.vue';

const route = useRoute();

const fromDate = route.params.fromDate;

const expenseDetailsStore = useExpenseDetailsStore();

const expenseListsStore = useExpenseListsStore();

onMounted(() => {
  console.log('Expense Detail Id from route', route.params.id)
  expenseDetailsStore.getExpenseDetails(route.params.id);
  expenseListsStore.getExpensesList();
});

const expenseDetails = computed(() => {
  return expenseDetailsStore.expenseDetailsList;
});

const periodOptions = computed(() => {
  return expenseListsStore.PeriodList;
});

const expensePeriod = ref('');

watch([periodOptions], () => {

  expensePeriod.value = periodOptions.value.find((x) => x.start.toString() === fromDate);

  console.log('Expense period in Expense details', expensePeriod)
});


</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title> Expense Details </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="q-ma-sm">
      <q-list v-for="expenseDetail in expenseDetails" :key="expenseDetail.id" class="rounded-borders q-my-md bg-grey-3">
        <q-expansion-item expand-separator expand-icon-class="text-primary">
          <template v-slot:header>
            <q-item-section>
              <q-item-label>
                {{ expenseDetail.accountName }} : {{ expenseDetail.projectName }}
              </q-item-label>
              <q-item-label caption>
                {{
                  expenseDetail.expenseDate
                  ? dateTimeHelper.extractDateFromUtc(
                    expenseDetail.expenseDate
                  )
                  : 'No Specific Date'
                }}
              </q-item-label>
            </q-item-section>

            <q-item-section side flex>
              <q-item-label caption>
                {{ expenseDetail.amount }}
                <q-btn :to="{
                  name: 'editExpense',
                  params: {
                    id: expenseDetail?.id,
                    expenseSid: expenseDetail?.expenseSid,
                    fromDate: fromDate
                  },
                }" size="sm" flat round dense icon="edit" class="q-ml-sm">
                </q-btn>
              </q-item-label>
            </q-item-section>
          </template>
          <q-item-section class="q-ma-md">

            <q-item-label caption> Billable </q-item-label>
            <q-item-label class="q-mb-sm">
              {{ expenseDetail.billable ? 'Yes' : 'No' }}
            </q-item-label>

            <q-item-label caption> Description </q-item-label>
            <q-item-label>
              {{ expenseDetail.description }}
            </q-item-label>

            <autoRentalExpense v-if="expenseDetail.autoRentalExpense" :expense="expenseDetail.autoRentalExpense" />

            <airTravelExpense v-if="expenseDetail.airTravelExpense" :expense="expenseDetail.airTravelExpense" />

            <hotelExpense v-if="expenseDetail.hotelExpense" :expense="expenseDetail.hotelExpense" />

            <mileageExpense v-if="expenseDetail.mileageExpense" :expense="expenseDetail.mileageExpense" />

            <taxiExpense v-if="expenseDetail.taxiExpense" :expense="expenseDetail.taxiExpense" />

            <telephoneExpense v-if="expenseDetail.telephoneExpense" :expense="expenseDetail.telephoneExpense" />

          </q-item-section>

          <q-item-section side flex>
            <q-item-label>
              <q-btn @click="
                expenseDetailsStore.deleteExpense(expenseDetail?.id);
              $router.go(-1);
              " size="sm" flat round dense icon="delete" class="q-mr-sm q-mb-sm"></q-btn>
            </q-item-label>
          </q-item-section>
        </q-expansion-item>
      </q-list>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn :to="{
          name: 'newExpense',
          params: {
            period: expensePeriod?.name
          }
        }" fab icon="add" color="accent" padding="sm">
        </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>
