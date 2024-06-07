<script lang="ts" setup>
import { onBeforeMount, ref, Ref, computed } from 'vue';
import { useTaskListsStore } from 'stores/task/taskListsStore';
import { useUserSummaryStore } from 'stores/userSummaryStore';
import { userSummary } from 'src/models/userSummary';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps(['taskSid']);
const taskListsStore = useTaskListsStore();
const userSummaryStore = useUserSummaryStore();
const $q = useQuasar();
const router = useRouter();

onBeforeMount(async () => {
  try {
    await taskListsStore.getTaskLists();
    await userSummaryStore.getUserSummaries();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/tasksList' });
    });
  }
});

const assignee = computed(() => {
  return taskListsStore.users;
});

const contactOptions: Ref<userSummary[]> = ref([]);

async function filterFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();
    contactOptions.value = userSummaryStore.userSummaries.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

const subtask = ref({
  id: '',
  parentId: props.taskSid,
  title: '',
  description: '',
  assignee: [],
  isCompleted: false,
  completedDate: ''
})

const emit = defineEmits(['saveSubtask']);

function emitSubtask() {
  emit('saveSubtask', subtask.value);
}

</script>

<template>
  <q-card>
    <div class="q-pa-md column">
      <q-input v-model="subtask.title" :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        label="Subject" lazy-rules placeholder="Enter Subtask Title" />

      <q-input v-model="subtask.description" class="q-mt-none" label="Description" placeholder="Type Here...." />

      <q-item-section>
        <q-select v-model="subtask.assignee" :options="contactOptions" label="Assigned to" option-label="name" use-chips
          use-input @filter="filterFn">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </div>

    <q-card-actions>
      <q-btn v-close-popup color="primary" label="Apply" @click="emitSubtask" />
    </q-card-actions>
  </q-card>

</template>
