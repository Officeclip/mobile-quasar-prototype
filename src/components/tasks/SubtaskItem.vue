<script lang="ts" setup>
import { useTaskDetailsStore } from 'stores/task/taskDetailsStore';
import { ref } from 'vue';
import addEditSubtaskDialog from 'components/tasks/addEditSubtaskDialog.vue';
import { useQuasar } from 'quasar';
import { subTask } from 'src/models/task/subtask';

const props = defineProps<{
  subtask: subTask;
  taskSid: string;
}>();

const subtask = ref(props.subtask);
const taskDetailsStore = useTaskDetailsStore();
const $q = useQuasar();

function toggleSubtaskStatus(id: string) {
  taskDetailsStore.toggleSubtaskCompletion(id);
}

const deleteSubtask = async (id: string) => {
  try {
    await taskDetailsStore.deleteSubtask(id);
    showConfirmationDialog.value = false;
    window.location.reload();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  }
};
async function editSubtask(subtask: subTask) {
  try {
    taskDetailsStore.editSubtask(subtask);
    showEditSubtaskDialog.value = false;
    window.location.reload();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      showEditSubtaskDialog.value = true;
    });
  }
}

// const newSubtask = ref({
//   id: '',
//   parentId: props.taskSid,
//   title: '',
//   description: '',
//   assignee: {
//     id: '',
//     name: '',
//   },
//   isCompleted: false,
//   completedDate: '',
// });

// if (!subtask.value.id) {
//   subtask.value = newSubtask.value;
// }

const showEditSubtaskDialog = ref(false);
const showConfirmationDialog = ref(false);
</script>

<template>
  <q-item>
    <q-item-section avatar top>
      <q-icon
        v-if="!subtask.isCompleted"
        color="grey-8"
        name="hourglass_top"
        size="34px"
      />
      <q-icon
        v-if="subtask.isCompleted"
        color="green-9"
        name="done_all"
        size="34px"
      />
    </q-item-section>

    <q-item-section top>
      <q-item-label lines="1" :class="subtask.isCompleted ? 'text-strike' : ''">
        <span class="text-weight-medium">{{ subtask.title }}</span>
        <span class="text-grey-8"> - {{ subtask.assignee?.name }} </span>
      </q-item-label>
      <q-item-label
        caption
        lines="1"
        :class="subtask.isCompleted ? 'text-strike' : ''"
      >
        {{ subtask.description }}</q-item-label
      >
      <q-item-label
        class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
        lines="1"
      >
        <span
          v-if="!subtask.isCompleted"
          class="cursor-pointer"
          @click="toggleSubtaskStatus(subtask.id)"
          >Mark as complete</span
        >
        <span
          v-if="subtask.isCompleted"
          class="cursor-pointer"
          @click="toggleSubtaskStatus(subtask.id)"
          >Mark as incomplete</span
        >
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      <div class="text-grey-8 q-gutter-xs">
        <q-btn
          dense
          flat
          icon="delete"
          round
          size="12px"
          @click="showConfirmationDialog = true"
        />
        <q-btn
          dense
          flat
          icon="edit"
          round
          size="12px"
          @click="showEditSubtaskDialog = true"
        />
      </div>
    </q-item-section>
  </q-item>

  <q-dialog v-model="showConfirmationDialog">
    <q-card>
      <q-card-section>
        <q-item-label>Confirm</q-item-label>
        <q-item-label
          >Are you sure you want to delete this subtask?</q-item-label
        >
        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="Cancel"
            @click="showConfirmationDialog = false"
          />
          <q-btn
            color="negative"
            label="Delete"
            @click="deleteSubtask(subtask.id)"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showEditSubtaskDialog">
    <add-edit-subtask-dialog
      :subtask="subtask"
      :taskSid="taskSid"
      @save-subtask="editSubtask"
    />
  </q-dialog>
</template>
