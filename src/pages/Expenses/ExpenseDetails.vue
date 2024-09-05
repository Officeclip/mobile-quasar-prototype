<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
// import { useExpenseListsStore } from '../../stores/expense/expenseListsStore';
import { useRoute, useRouter } from 'vue-router';
// import dateTimeHelper from '../../helpers/dateTimeHelper';
import autoRentalExpense from '../../components/expenses/details/autoRentalExpense.vue';
import airTravelExpense from '../../components/expenses/details/airTravelExpense.vue';
import hotelExpense from '../../components/expenses/details/hotelExpense.vue';
import mileageExpense from '../../components/expenses/details/mileageExpense.vue';
import taxiExpense from '../../components/expenses/details/taxiExpense.vue';
import telephoneExpense from '../../components/expenses/details/telephoneExpense.vue';
import ConfirmDelete from '../../components/general/ConfirmDelete.vue';
import WorkFlow from '../../components/general/WorkFlow.vue';
import { useTECommentsStore } from '../../stores/TECommentsStore';
import { useQuasar } from 'quasar';
import { isAllowed } from 'src/helpers/security';
import logger from 'src/helpers/logger';
import drawer from '../../components/drawer.vue';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const expenseDetailsStore = useExpenseDetailsStore();
const expenseCommentsStore = useTECommentsStore();

const id = route.params.id;
const employeeId = route.params.employeeId;
const stageId = Number(route.params.stageId);
const entityType = 'expense';
const fromDate = route.params.fromDate;
const toDate = route.params.toDate;
const status = route.params.status;
const isLoaded = ref<boolean>(false);

const isAllowedWrite = ref();
const isAllowedDelete = ref();
const myDrawer = ref();

onMounted(async () => {
  try {
    await expenseDetailsStore.getExpenseDetails(id, stageId);
    await expenseCommentsStore.$reset();
    await expenseCommentsStore.getExpenseComments(id);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/expensesAll' });
    });
  } finally {
    isLoaded.value = true;
  }
  isAllowedWrite.value = isAllowed({
    security: {
      write: expenseDetails?.value[0].security.write,
    },
    isTimeExpense: true,
  });
  isAllowedDelete.value = isAllowed({
    security: {
      delete: expenseDetails?.value[0].security.delete,
    },
    isTimeExpense: true,
  });
});

const expenseDetails = computed(() => {
  return expenseDetailsStore.expenseDetailsList;
});

const commentsList = computed(() => {
  return expenseCommentsStore.commentsList;
});

const listLength = computed(() => {
  return commentsList.value.length;
});
const title = ref('Confirm');
const message = ref('Are you sure you want to delete this expense?');

const isExpenseDetailDelete = ref(false);
const showExpenseDetailDelete = (id: string) => {
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
const deleteExpense = async (id: string) => {
  {
    try {
      await expenseDetailsStore.deleteExpense(id);
      isExpenseDelete.value = false;
      router.go(-1);
    } catch (error) {
      $q.dialog({
        title: 'Alert',
        message: error as string,
      }).onOk(async () => {
        logger.log('*** Delete expense:onSubmit(...):onOK ***');
        isExpenseDelete.value = false;
      });
    }
  }
};
const deleteExpenseDetail = async (id: string) => {
  {
    try {
      await expenseDetailsStore.deleteExpenseDetail(id);
      isExpenseDetailDelete.value = false;
      router.go(-1);
    } catch (error) {
      $q.dialog({
        title: 'Alert',
        message: error as string,
      }).onOk(async () => {
        logger.log('*** Delete expense detail:onSubmit(...):onOK ***');
        isExpenseDelete.value = false;
      });
    }
  }
};

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
  <q-layout view="lHh Lpr lFf" v-if="isLoaded">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          @click="router.push({ path: '/expensesAll' })"
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
        <q-toolbar-title> Expense Details </q-toolbar-title>
        <q-btn
          v-if="isAllowedDelete"
          flat
          round
          dense
          color="white"
          icon="delete"
          @click="displayConfirmationDialog"
        >
        </q-btn>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-page-container class="q-ma-sm">
      <div>
        <WorkFlow
          v-if="status != 'Approved' && status != 'Pending'"
          :entityId="id"
          :employeeId="employeeId"
          :entityType="entityType"
          :stageId="stageId"
        />
      </div>
      <div v-for="expenseDetail in expenseDetails" :key="expenseDetail.id">
        <q-list class="rounded-borders q-my-md bg-grey-3">
          <q-expansion-item
            expand-separator
            expand-icon-class="text-primary"
            class="bg-white"
          >
            <template v-slot:header>
              <q-item-section>
                <q-item-label
                  v-if="
                    expenseDetail.accountName !== '' ||
                    expenseDetail.projectName !== ''
                  "
                >
                  {{ expenseDetail.accountName }} :
                  {{ expenseDetail.projectName }}
                </q-item-label>
                <q-item-label caption>
                  {{
                    expenseDetail.expenseDate
                      ? expenseDetail.expenseDate
                      : 'No Specific Date'
                  }}
                </q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  {{ expenseDetail.amount.toFixed(2) }}
                  <span class="text-caption q-pl-xs">{{
                    expenseDetail.currency
                  }}</span>
                </q-item-label> </q-item-section
              ><q-item-section side>
                <q-item-label>
                  <q-btn
                    v-if="isAllowedWrite"
                    :to="{
                      name: 'editExpense',
                      params: {
                        id: expenseDetail?.id,
                        expenseSid: expenseDetail?.expenseSid,
                        fromDate: fromDate,
                        toDate: toDate,
                      },
                    }"
                    size="sm"
                    flat
                    round
                    dense
                    icon="edit"
                    class="q-ml-sm"
                  >
                  </q-btn>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  v-if="isAllowedDelete"
                  @click="showExpenseDetailDelete(expenseDetail?.expenseSid)"
                  size="sm"
                  flat
                  round
                  dense
                  icon="delete"
                  class="q-btn-hover:hover"
                ></q-btn>
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

              <autoRentalExpense
                v-if="expenseDetail.autoRentalExpense"
                :expense="expenseDetail.autoRentalExpense"
              />

              <airTravelExpense
                v-if="expenseDetail.airTravelExpense"
                :expense="expenseDetail.airTravelExpense"
              />

              <hotelExpense
                v-if="expenseDetail.hotelExpense"
                :expense="expenseDetail.hotelExpense"
              />

              <mileageExpense
                v-if="expenseDetail.mileageExpense"
                :expense="expenseDetail.mileageExpense"
              />

              <taxiExpense
                v-if="expenseDetail.taxiExpense"
                :expense="expenseDetail.taxiExpense"
              />

              <telephoneExpense
                v-if="expenseDetail.telephoneExpense"
                :expense="expenseDetail.telephoneExpense"
              />
            </q-item-section>
          </q-expansion-item>
        </q-list>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn
            v-if="isAllowedWrite"
            :to="{
              name: 'newExpense',
              params: {
                fromDate: fromDate,
                toDate: toDate,
                expenseSid: expenseDetail.expenseSid,
              },
            }"
            fab
            icon="add"
            color="accent"
            padding="sm"
          >
          </q-btn>
        </q-page-sticky>

        <ConfirmDelete
          v-if="isExpenseDelete"
          :showConfirmationDialog="isExpenseDelete"
          :id="id"
          :title="title"
          :message="message"
          @cancel="cancelConfirmation"
          @confirm="deleteExpense"
        />
        <ConfirmDelete
          v-if="isExpenseDetailDelete"
          :showConfirmationDialog="isExpenseDetailDelete"
          :id="expenseDetail.id"
          :title="title"
          :message="message"
          @cancel="cancelConfirmation"
          @confirm="deleteExpenseDetail"
        />
      </div>
      <q-card v-if="expenseDetails.length > 0" class="q-ma-sm bg-grey-4">
        <q-expansion-item
          default-opened
          expand-separator
          expand-icon-class="text-primary"
        >
          <template v-slot:header>
            <q-item-section>
              <q-item-label>Comments: </q-item-label>
            </q-item-section>
          </template>
          <q-list>
            <q-item v-for="comments in commentsList" :key="comments.id">
              <q-item-section style="white-space: pre-wrap"
                >{{ comments.text_comment }}
              </q-item-section>
              <q-item-section style="white-space: pre-wrap">
                by {{ comments.commentedUserName }} on
                {{ comments.commentedDate.split('T')[0] }}
              </q-item-section>
            </q-item>
            <q-item v-if="listLength == 0"> No Comments are present </q-item>
          </q-list>
        </q-expansion-item>
      </q-card>
    </q-page-container>
  </q-layout>
</template>
