<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, computed, ref, Ref } from 'vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import { useRouter, useRoute } from 'vue-router';
import ExpenseForm from '../../components/expenses/ExpenseFormCtrl.vue';
import { useQuasar } from 'quasar';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';
import { ExpenseDetails } from 'src/models/expenseDetails';

const expenseDetailsStore = useExpenseDetailsStore();

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const id = computed(() => {
  return route.params.id;
});

const fromDate: any = route.params.fromDate;
const toDate: any = route.params.toDate;

const expenseDetail: Ref<ExpenseDetails> = ref(null);

onMounted(async () => {
  try {
    await expenseDetailsStore.getExpenseDetailById(id.value);
    const response = expenseDetailsStore.ExpenseDetails;
    expenseDetail.value = response;
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/expensesAll' });
    });
  }
});

const childComponent = ref(null);

async function onSubmit() {
  try {
    if (!childComponent.value.validateAll()) return;
    const editExpense = ref(expenseDetail);

    await expenseDetailsStore.editExpense(editExpense?.value);
    router.go(-2);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  }
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      title="Edit Expense"
      :show-save-button="true"
      @save="onSubmit"
    ></OC_Header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <ExpenseForm
            ref="childComponent"
            v-if="expenseDetail"
            :expenseDetail="expenseDetail"
            :fromDate="fromDate"
            :toDate="toDate"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
