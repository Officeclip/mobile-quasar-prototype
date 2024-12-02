<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- Cleaned up using Google Bard -->
<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useExpenseDetailsStore } from '../../stores/expense/expenseDetailsStore';
import { useRouter, useRoute } from 'vue-router';
import ExpenseForm from '../../components/expenses/ExpenseFormCtrl.vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';

const expenseDetailsStore = useExpenseDetailsStore();

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const id = computed(() => {
  return route.params.id;
});

const fromDate: any = route.params.fromDate;
const toDate: any = route.params.toDate;

onMounted(async () => {
  try {
    await expenseDetailsStore.getExpenseDetailById(id.value);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/expensesAll' });
    });
  }
});

const expenseDetail = computed(() => {
  return expenseDetailsStore.ExpenseDetails;
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
        <q-toolbar-title>Edit Expense</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
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
