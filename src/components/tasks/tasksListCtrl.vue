<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useTaskSummaryStore } from 'stores/task/taskSummaryStore';
import TaskSummaryItem from 'components/tasks/TaskSummaryItem.vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps(['parent']);

const taskSummaryStore = useTaskSummaryStore();
const router = useRouter();
const $q = useQuasar();

const getTaskSummaries = computed(() => {
  taskSummaryStore.$reset();
  return taskSummaryStore.taskSummaries;
});

let reachedEnd = ref(false);
const loadMore = async (index: any, done: () => void) => {
  try {
    reachedEnd.value = await taskSummaryStore.getTasksUpdated(false);
    //https://quasar.dev/vue-components/infinite-scroll/#usage
    done();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
};

onBeforeMount(() => {
  taskSummaryStore.parentObjectId = props.parent.parentObjectId;
  taskSummaryStore.parentObjectServiceType =
    props.parent.parentObjectServiceType;
});
</script>
<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>
<template>
  <!-- <pre>{{ getTaskSummaries }}</pre> -->
  <q-infinite-scroll :disable="reachedEnd" @load="loadMore">
    <q-item v-for="task in getTaskSummaries" :key="task.id" class="q-pa-sm">
      <taskSummaryItem :task="task" class="full-width" />
    </q-item>
    <template v-slot:loading>
      <q-spinner-dots color="primary" size="40px" />
    </template>
  </q-infinite-scroll>
</template>
