<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTasksStore } from '../../stores/TasksStore';
import { useRoute } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';

const tasksStore = useTasksStore();
const isPrivate = ref<string>();
const id = ref<string | string[]>('0');

const task = computed(() => {
  return tasksStore.Task;
});

onMounted(() => {
  const route = useRoute();
  console.log('id=', route.params.id);
  id.value = route.params.id;
  tasksStore.getTask(Number(route.params.id));
});
isPrivate.value = task.value?.isPrivate ? 'Yes' : 'No';

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
        <q-toolbar-title> Task details </q-toolbar-title>

        <q-btn
          :to="{ name: 'editTask', params: { id: id } }"
          flat
          round
          dense
          color="white"
          icon="edit"
        />
        <q-btn
          @click="tasksStore.deleteTask(task?.id); $router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="delete"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-card class="relative-position card-example" flat bordered>
        <q-card-section class="q-pb-none">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Subject</q-item-label>
                <q-item-label class="q-mb-sm">{{ task?.subject }}</q-item-label>

                <q-item-label caption>Description</q-item-label>
                <q-item-label class="q-mb-sm">
                <div v-html="task?.description"> </div></q-item-label>
                <q-item-label caption>Start Date</q-item-label>
                <q-item-label class="q-mb-sm">{{
                task?.startDate
                  ? dateTimeHelper.extractDateFromUtc(task?.startDate)
                  : 'YYYY'
                }}</q-item-label>

                <q-item-label caption>Due Date</q-item-label>
                <q-item-label class="q-mb-sm">{{
                task?.dueDate
                  ? dateTimeHelper.extractDateFromUtc(task?.dueDate)
                  : 'YYYY'
                }}</q-item-label>

                <q-item-label caption>Task Type</q-item-label>
                <q-item-label class="q-mb-sm">{{ task?.taskTypeName }}</q-item-label>

                <q-item-label caption>Priority</q-item-label>
                <q-item-label class="q-mb-sm">{{ task?.taskPriorityName }}</q-item-label>

                <q-item-label caption>Status</q-item-label>
                <q-item-label class="q-mb-sm">{{ task?.taskStatusName }}</q-item-label>

                <q-item-label caption>Private</q-item-label>
                <q-item-label class="q-mb-sm">{{ isPrivate }}</q-item-label>

                <q-item-label caption>Owner</q-item-label>
                <q-item-label class="q-mb-sm">{{ task?.taskOwnerName }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<style></style>
