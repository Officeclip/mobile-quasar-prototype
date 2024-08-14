<script lang="ts" setup>
import { subTask } from 'src/models/task/subtask';
import { useTaskDetailsStore } from 'stores/task/taskDetailsStore';
import { ref } from 'vue';
import EditSubtaskDialog from 'components/tasks/editSubtaskDialog.vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import logger from 'src/helpers/logger';

const props = defineProps<{
  subtask: subTask;
}>();
const taskDetailsStore = useTaskDetailsStore();
const router = useRouter();
const $q = useQuasar();

function toggleSubtaskStatus(id: string) {
  taskDetailsStore.toggleSubtaskCompletion(id);
}

const deleteSubtask = async (id: string) => {
  try {
    await taskDetailsStore.deleteSubtask(id);
    showConfirmationDialog.value = false;
    router.go(0);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      logger.log('*** Delete task:onSubmit(...):onOK ***');
      showConfirmationDialog.value = false;
    });
  }
};

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
        <span class="text-grey-8"> - {{ subtask.assignee.name }} </span>
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
    <edit-subtask-dialog :subtask="subtask" />
  </q-dialog>
</template>
