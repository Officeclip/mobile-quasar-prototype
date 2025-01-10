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

const errorMsg = computed(() => {
  return taskSummaryStore.errorMsg;
});

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

const infiniteScroll = ref(null);

function infinteScrollReset() {
  console.log('******** infinteScrollReset **********');
  loadMore(0, () => {
    console.log('Data loaded and reachedEnd reset!');
  });
}

defineExpose({ infinteScrollReset });
</script>
<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>
<template>
  <q-item-section v-if="errorMsg !== ''">
    <div class="flex justify-center">
      <span class="text-subtitle1 text-weight-medium inline q-mr-xs">{{
        errorMsg
      }}</span>
    </div>
  </q-item-section>
  <q-infinite-scroll
    v-else
    ref="infiniteScroll"
    :disable="reachedEnd"
    @load="loadMore"
  >
    <q-item v-for="task in getTaskSummaries" :key="task.id" class="q-pa-sm">
      <TaskSummaryItem
        :task="task"
        :appName="parent.appName"
        class="full-width"
      />
    </q-item>
    <template v-slot:loading>
      <q-spinner-dots color="primary" size="40px" />
    </template>
  </q-infinite-scroll>
</template>
