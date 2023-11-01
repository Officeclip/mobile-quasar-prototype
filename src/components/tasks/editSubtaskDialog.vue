<script lang="ts" setup>
import {onBeforeMount, ref, Ref, toRefs} from 'vue';
import {useTaskListsStore} from "stores/task/taskListsStore";
import {regardingContact} from "src/models/task/taskLists";
import {subTask} from "src/models/task/subtask";
import {useTaskDetailsStore} from "stores/task/taskDetailsStore";
import {useUserSummaryStore} from "stores/userSummaryStore";
import {userSummary} from "src/models/userSummary";

const props = defineProps<{
  subtask: subTask
}>();


const {subtask} = toRefs(props);

const taskListsStore = useTaskListsStore();
const taskDetailsStore = useTaskDetailsStore();
const userSummaryStore = useUserSummaryStore();


function editSubtask() {
  taskDetailsStore.editSubtask(subtask.value);
}

onBeforeMount(() => {
  taskListsStore.getTaskLists();
  userSummaryStore.getUserSummaries();

});

const contactOptions: Ref<userSummary[]> = ref([]);

async function filterFn(val: string, update: any, abort: any) {
  update(() => {
    console.log('update');
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
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
        label="Subject"
        lazy-rules outlined
        placeholder="Enter Subtask Title"
        square
      />

      <q-input
        v-model="subtask.description"
        class="q-mt-none"
        label="Description"
        outlined
        placeholder="Type Here...." square
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
      <q-btn v-close-popup color="primary" label="Apply" @click="editSubtask"/>
    </q-card-actions>
  </q-card>

</template>

