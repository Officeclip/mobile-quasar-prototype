<script lang="ts" setup>
import { onBeforeMount, ref, Ref, toRefs } from 'vue';
import { useTaskListsStore } from 'stores/task/taskListsStore';
import { subTask } from 'src/models/task/subtask';
import { useTaskDetailsStore } from 'stores/task/taskDetailsStore';
import { useUserSummaryStore } from 'stores/userSummaryStore';
import { userSummary } from 'src/models/userSummary';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps<{
  subtask: subTask;
}>();

const { subtask } = toRefs(props);
const taskListsStore = useTaskListsStore();
const taskDetailsStore = useTaskDetailsStore();
const userSummaryStore = useUserSummaryStore();
const $q = useQuasar();
const router = useRouter();

function editSubtask() {
  taskDetailsStore.editSubtask(subtask.value);
}

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

const contactOptions: Ref<userSummary[]> = ref([]);

async function filterFn(val: string, update: any) {
  update(() => {
    const needle = val.toLowerCase();
    contactOptions.value = userSummaryStore.userSummaries.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}
</script>

<template>
  <q-card>
    <div class="q-pa-md column">
      <q-input
        v-model="subtask.title"
        :rules="[(val) => (val && val.length > 0) || 'Please type title']"
        label="Subject"
        lazy-rules
        outlined
        placeholder="Enter Subtask Title"
        square
      />

      <q-input
        v-model="subtask.description"
        class="q-mt-none"
        label="Description"
        outlined
        placeholder="Type Here...."
        square
        type="textarea"
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
      <q-btn v-close-popup color="primary" label="Apply" @click="editSubtask" />
    </q-card-actions>
  </q-card>
</template>
