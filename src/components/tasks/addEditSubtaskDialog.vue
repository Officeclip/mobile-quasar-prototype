<script lang="ts" setup>
import { onBeforeMount, ref, Ref, computed, toRefs } from 'vue';
import { useTaskListsStore } from 'stores/task/taskListsStore';
import { useUserSummaryStore } from 'stores/userSummaryStore';
import { userSummary } from 'src/models/userSummary';
import { useQuasar, QInput } from 'quasar';
import { useRouter } from 'vue-router';
import { subTask } from 'src/models/task/subtask';

const props = defineProps<{
  subtask: subTask;
  taskSid: string;
}>();

const { subtask } = toRefs(props);
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

const newSubtask = ref({
  id: '',
  parentId: props.taskSid,
  title: '',
  description: '',
  assignee: {
    id: '',
    name: '',
  },
  isCompleted: false,
  completedDate: '',
});

if (!subtask.value.id) {
  subtask.value = newSubtask.value;
}

const emit = defineEmits(['saveSubtask']);

function emitSubtask() {
  validateAll();
}

const eventNameRef = ref<QInput>(); // from: https://stackoverflow.com/a/65106524

const errorMsg = ref('');

const ruleNotEmpty = (val: string) => {
  const condition = val && val.length > 0;
  return condition;
};

const validateAll = () => {
  if (eventNameRef.value?.validate()) {
    emit('saveSubtask', subtask.value);
  } else {
    errorMsg.value = 'Please type subject';
  }
};

defineExpose({
  emitSubtask,
});
</script>

<template>
  <q-card>
    <div class="q-pa-md column">
      <q-input
        v-model="subtask.title"
        ref="eventNameRef"
        :rules="[ruleNotEmpty]"
        hide-bottom-space
        :error-message="errorMsg"
        label="* Subject"
        lazy-rules
        placeholder="Enter Subtask Title"
        label-color="red"
      />

      <q-input
        v-model="subtask.description"
        class="q-mt-none"
        label="Description"
        placeholder="Type Here...."
      />

      <q-item-section>
        <q-select
          v-model="subtask.assignee"
          :options="contactOptions"
          label="Assigned to"
          option-label="name"
          option-value="name"
          use-chips
          use-input
          @filter="filterFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">No results</q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-item-section>
    </div>

    <q-card-actions>
      <q-btn color="primary" label="Apply" @click="emitSubtask" />
    </q-card-actions>
  </q-card>
</template>
