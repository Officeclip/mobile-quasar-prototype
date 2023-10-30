<script setup lang="ts">
import ExpenseListCtrl from '../../components/expenses/ExpenseListCtrl.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const titleByStatus = route.params.status;
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn @click="$router.go(-1)" flat round dense color="white" icon="arrow_back">
        </q-btn>
        <q-toolbar-title> {{ titleByStatus }} Expenses </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <ExpenseListCtrl />
      </q-page>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn :to="{
          name: 'newPeriodExpense'
        }" fab icon="add" color="accent" padding="sm">
        </q-btn>
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
