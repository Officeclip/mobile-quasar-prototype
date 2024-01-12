<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useTaskSummaryStore } from 'stores/task/taskSummaryStore';
import TaskSummaryItem from 'components/tasks/TaskSummaryItem.vue';

const props = defineProps(['parent']);

const taskSummaryStore = useTaskSummaryStore();

const getTaskSummaries = computed(() => {
  taskSummaryStore.$reset();
  return taskSummaryStore.taskSummaries;
});

let reachedEnd = ref(false);
const loadMore = async (index: any, done: () => void) => {
  reachedEnd.value = await taskSummaryStore.getTasksUpdated();
  //https://quasar.dev/vue-components/infinite-scroll/#usage
  done();
};

onBeforeMount(() => {
  // taskSummaryStore.getTasks(Number(parentObjectId.value), Number(parentObjectServiceType.value));
  taskSummaryStore.parentObjectId = props.parent.parentObjectId;
  taskSummaryStore.parentObjectServiceType = props.parent.parentObjectServiceType;
});

</script>
<template>
  <q-infinite-scroll :disable="reachedEnd" @load="loadMore">
    <q-item v-for="task in getTaskSummaries" :key="task.id" class="q-pa-sm">
      <taskSummaryItem :task="task" class="full-width" />
    </q-item>
    <template v-slot:loading>
      <q-spinner-dots color="primary" size="40px" />
    </template>
  </q-infinite-scroll>
</template>
