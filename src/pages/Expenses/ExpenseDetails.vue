<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';
import { useRoute, useRouter } from 'vue-router';
import { useSessionStore } from 'stores/SessionStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import autoRentalExpense from '../../components/expenses/details/autoRentalExpense.vue';
import airTravelExpense from '../../components/expenses/details/airTravelExpense.vue';
import hotelExpense from '../../components/expenses/details/hotelExpense.vue';
import mileageExpense from '../../components/expenses/details/mileageExpense.vue';
import taxiExpense from '../../components/expenses/details/taxiExpense.vue';
import telephoneExpense from '../../components/expenses/details/telephoneExpense.vue';
import ConfirmDelete from '../../components/general/ConfirmDelete.vue';
import WorkFlow from '../../components/general/WorkFlow.vue';

const route = useRoute();
const router = useRouter();

const entityType = 'expense';

const fromDate = route.params.fromDate;

const expenseDetailsStore = useExpenseDetailsStore();

const expenseListsStore = useExpenseListsStore();

const usesessionStore = useSessionStore();

onMounted(() => {
  console.log('Expense Detail Id from route', route.params.id)
  expenseDetailsStore.getExpenseDetails(route.params.id);
  expenseListsStore.getExpensesList();
  usesessionStore.getSession();
});

const getSession = computed(() => {
  return usesessionStore.Session;
});

const getRoleAccess = computed(() => {
  return getSession.value.roleAccess;
});

const roleAccess = getRoleAccess.value;

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

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this expense?');

const isExpenseDetailDelete = ref(false);
const showExpenseDetailDelete = (id: string) => {
  //timesheetDetailSid.value = id;
  isExpenseDetailDelete.value = true;
};

const isExpenseDelete = ref(false);
const displayConfirmationDialog = () => {
  isExpenseDelete.value = true;
};
const cancelConfirmation = () => {
  isExpenseDelete.value = false;
  isExpenseDetailDelete.value = false;
};
const deleteExpense = (id: string) => {
  {
    expenseDetailsStore.deleteExpense(id).then(() => {
      isExpenseDelete.value = false;
      router.go(-1);
    });
  }
};
const deleteExpenseDetail = (id: string) => {
  {
    expenseDetailsStore.deleteExpenseDetail(id).then(() => {
      isExpenseDetailDelete.value = false;
      router.go(-1);
    });
  }
};


</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title> Expense Details </q-toolbar-title>
        <q-btn flat round dense color="white" icon="delete" @click="displayConfirmationDialog">
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container class="q-ma-sm">
      <div>
        <WorkFlow :entityId="route.params.id" :entityType="entityType" />
      </div>
      <div v-for="expenseDetail in expenseDetails" :key="expenseDetail.id">
        <q-list class="rounded-borders q-my-md bg-grey-3">
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
              <q-item-section side>
                <q-btn @click="
                  showExpenseDetailDelete(
                    expenseDetail?.expenseSid
                  )
                  " size="sm" flat round dense icon="delete" class="q-btn-hover:hover"></q-btn>
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

            <!-- <q-item-section side flex>
              <q-item-label>
                <q-btn @click="
                  expenseDetailsStore.deleteExpense(expenseDetail?.id);
                $router.go(-1);
                " size="sm" flat round dense icon="delete" class="q-mr-sm q-mb-sm"></q-btn>
              </q-item-label>
            </q-item-section> -->
          </q-expansion-item>
        </q-list>
        <q-page-sticky v-for="role in roleAccess" :key="role.name" position="bottom-right" :offset="[18, 18]">
          <q-btn v-if="role.name === 'TimeExpensesAccessExpenseReport' && role.access" :to="{
            name: 'newExpense',
            params: {
              expenseSid: expenseDetail.expenseSid,
              period: expensePeriod?.name
            }
          }" fab icon="add" color="accent" padding="sm">
          </q-btn>
        </q-page-sticky>

        <ConfirmDelete v-if="isExpenseDelete" :showConfirmationDialog="isExpenseDelete" :id="route.params.id"
          :title="title" :message="message" @cancel="cancelConfirmation" @confirm="deleteExpense" />
        <ConfirmDelete v-if="isExpenseDetailDelete" :showConfirmationDialog="isExpenseDetailDelete" :id="expenseDetail.id"
          :title="title" :message="message" @cancel="cancelConfirmation" @confirm="deleteExpenseDetail" />
      </div>
    </q-page-container>
  </q-layout>
</template>
