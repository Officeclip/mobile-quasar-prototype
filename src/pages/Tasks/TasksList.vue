<script lang="ts" setup>
import {ref} from 'vue';
import TasksList from '../../components/Tasks/TasksListCtrl.vue';

const model = ref(null);
const ownedByMe = ref(false);
const assignedToMe = ref(false);
const ownerName = ref("Alice Johnson");
const parent = ref({
  parentObjectId: -1,
  parentObjectServiceType: -1,
});
const options = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'];
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-primary text-white" height-hint="98" reveal>
      <q-toolbar>
        <q-btn
          color="white"
          dense
          flat
          icon="arrow_back"
          round
          @click="$router.go(-1)"
        >
        </q-btn>
        <q-toolbar-title> Tasks</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-space class="q-mt-sm"/>
    <q-page-container>
      <q-page>
        <!--        <div class="q-pa-sm text-caption row">-->
        <!--          <div class="col-8">Filter</div>-->
        <!--          <div class="col-2">Owned by</div>-->
        <!--          <div class="col-2">Assigned to</div>-->
        <!--        </div>-->
        <div class="q-pa-sm row text-center">
          <div class="col-4">
            <q-select
              v-model="model"
              :options="options"
              dense
              label="Select Filter"
              outlined
            />
          </div>
          <div class="col-3">
            <q-checkbox v-model="ownedByMe" dense label="Owned by me"/>
          </div>
          <div class="col-3">
            <q-checkbox v-model="assignedToMe" dense label="Assigned to me"/>
          </div>
        </div>
        <TasksList :params="parent" :owner="ownerName" :ownerFilter="ownedByMe"/>
      </q-page>
      <q-page-sticky :offset="[18, 18]" position="bottom-right">
        <q-btn
          :to="{
            name: 'newTask',
            params: {
              id: -1,
            },
          }"
          color="accent"
          fab
          icon="add"
          padding="sm"
        />
      </q-page-sticky>
    </q-page-container>
  </q-layout>
</template>

<style></style>
