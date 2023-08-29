<script setup lang="ts">
import { ref } from 'vue';
import TasksList from '../../components/Tasks/TasksListCtrl.vue';
const model = ref(null);
const value1 = ref(null);
const parent = ref({
  parentObjectId: -1,
  parentObjectServiceType: -1,
});
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'];
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> Tasks </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <div class="q-pa-sm text-caption row">
          <div class="col-8">Filter</div>
          <div class="col-2">Owned by</div>
          <div class="col-2">Assigned to</div>
        </div>
        <div class="q-pa-sm row text-center">
          <div class="col-8">
            <q-select
              outlined
              dense
              v-model="model"
              :options="options"
              label="Select Filter"
            />
          </div>
          <div class="col-2">
            <q-toggle dense v-model="value1" />
          </div>
          <div class="col-2">
            <q-toggle dense v-model="value1" />
          </div>
        </div>
        <TasksList :params="parent" />
      </q-page>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          :to="{
            name: 'newTask',
            params: {
              id: -1,
            },
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

<style></style>
