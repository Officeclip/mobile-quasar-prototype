<script lang="ts" setup>
import {onBeforeMount, ref, Ref} from 'vue';
import {useTaskListsStore} from "stores/task/taskListsStore";
import {regardingContact} from "src/models/task/taskLists";
import {useUserSummaryStore} from "stores/userSummaryStore";
import {userSummary} from "src/models/userSummary";


const subtask = ref({
  id: '',
  parentId: 101,
  title: '',
  description: "",
  assignee: {
    id: "1",
    name: "Kathiravan Sekar"
  },
  isCompleted: false,
  completedDate: "2023-10-05T17:00:00Z"
})

const emit = defineEmits(['saveSubtask']);

function emitSubtask() {
  emit('saveSubtask', subtask.value);
}

const taskListsStore = useTaskListsStore();
const userSummaryStore = useUserSummaryStore();

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
        lazy-rules
        placeholder="Enter Subtask Title"
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
      <q-btn v-close-popup color="primary" label="Apply" @click="emitSubtask"/>
    </q-card-actions>
  </q-card>

</template>

