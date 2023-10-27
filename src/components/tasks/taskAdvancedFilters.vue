<script lang="ts" setup>
import {onBeforeMount, ref, Ref} from 'vue';
import {useTaskListsStore} from "stores/task/taskListsStore";
import {regardingContact} from "src/models/task/taskLists";
import {useTaskSummaryStore} from "stores/task/taskSummaryStore";
import {searchFilter} from "src/models/task/searchFilter";

const advancedOptions:Ref<searchFilter> = ref({
  filterString: '',
  ownedByMeFilter: false,
  assignedToMeFilter: false,
  showAdvancedOptions: false,
  userName: '',
  dueDateValue: '',
  dueDateOption: '',
  modifiedDateValue: '',
  modifiedDateOption: '',
  statusName: '',
  priorityName: '',
  taskTypeValue: '',
  assignedTo: '',
  ownedBy: '',
  regarding: ''
})

const emit = defineEmits(['advancedOptionsGenerated']);
const props = defineProps(['parent']);
const taskSummaryStore = useTaskSummaryStore();

function emitOptions() {
  taskSummaryStore.getFilteredTasks(advancedOptions.value, props.parent?.parentObjectId, props.parent?.parentObjectServiceType);

  emit('advancedOptionsGenerated', advancedOptions.value);
}

const taskListsStore = useTaskListsStore();
onBeforeMount(() => {
  taskListsStore.getTaskLists();
});

const dateOptions = [
  {label: "On this day", value: "EqualTo"},
  {label: "Not on this day", value: "NotEqualTo"},
  {label: "After this day", value: "GreaterThan"},
  {label: "Before this day", value: "LessThan"},
  {label: "On or after this day", value: "GreaterOrEqual"},
  {label: "On or before this day", value: "LessOrEqual"},
  {label: "No date", value: "isNull"},
  {label: "Any date", value: "isNotNull"},
];

const contactOptions: Ref<regardingContact[]> = ref([]);

async function filterFn(val: string, update: any, abort: any) {
  if (val.length < 2) {
    abort();
    return;
  } else if (val.length === 2) {
    contactOptions.value = [];
    await taskListsStore.getRegardingContactListThatMatch(val);
    contactOptions.value = taskListsStore.regardingContacts;
  }

  update(() => {
    console.log('update');
    const needle = val.toLowerCase();
    contactOptions.value = taskListsStore.regardingContacts.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}


</script>

<template>
  <q-card style="width: 700px; max-width: 80vw;">

    <div class="q-pa-md row">
      <q-item-section>
        <q-item-label>Due Date</q-item-label>
        <q-input
          v-model="advancedOptions.dueDateValue"
          clearable
          label="Due Date"
          outlined
          type="date"
        />
        <q-select v-model="advancedOptions.dueDateOption" :options="dateOptions"
                  clearable
                  emit-value
                  map-options
                  option-label="label"
                  option-value="value"/>
      </q-item-section>

      <q-item-section>
        <q-item-label>Modified Date</q-item-label>
        <q-input
          v-model="advancedOptions.modifiedDateValue"
          clearable
          label="Modified Date"
          outlined
          type="date"
        />
        <q-select v-model="advancedOptions.modifiedDateOption" :options="dateOptions"
                  clearable
                  emit-value
                  map-options
                  option-label="label"
                  option-value="value"/>
      </q-item-section>
    </div>

    <div class="q-pa-md row">
      <q-item-section>
        <q-item-label>Status</q-item-label>
        <q-select v-model="advancedOptions.statusName"
                  :options="taskListsStore.TaskStatuses"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="name"/>
      </q-item-section>

      <q-item-section>
        <q-item-label>Priority</q-item-label>
        <q-select v-model="advancedOptions.priorityName" :options="taskListsStore.TaskPriorities"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="name"/>
      </q-item-section>

      <q-item-section>
        <q-item-label>Task Type</q-item-label>
        <q-select v-model="advancedOptions.taskTypeValue"
                  :options="taskListsStore.TaskTypes"
                  emit-value
                  map-options
                  option-label="name"
                  option-value="id"/>
      </q-item-section>
    </div>

    <div class="q-pa-md row">

      <q-item-section>
        <q-item-label>Assigned To</q-item-label>
        <q-select v-model="advancedOptions.assignedTo"
                  :options="contactOptions"
                  clearable
                  emit-value
                  option-label="name"
                  option-value="name"
                  use-input
                  @filter="filterFn"/>
      </q-item-section>

      <q-item-section>
        <q-item-label>Owned By</q-item-label>
        <q-select v-model="advancedOptions.ownedBy"
                  :options="contactOptions"
                  clearable
                  emit-value
                  option-label="name"
                  option-value="name"
                  use-input
                  @filter="filterFn"/>
      </q-item-section>
    </div>

    <q-card-actions>
      <q-btn v-close-popup color="primary" label="Apply" @click="emitOptions"/>
    </q-card-actions>
  </q-card>

</template>

<style scoped>
.select-spacing {
  margin: 5px; /* Adjust the margin as needed */
}
</style>

<!--<script lang="ts" setup>-->
<!--import {ref} from 'vue';-->

<!--const advancedOptions = ref({-->
<!--  dueDateValue: '',-->
<!--  dueDateOption: '',-->
<!--  modifiedDateValue: '',-->
<!--  modifiedDateOption: '',-->
<!--  statusValue: '',-->
<!--  priorityValue: '',-->
<!--  assignedTo: '',-->
<!--  ownedBy: '',-->
<!--  regarding: ''-->
<!--})-->

<!--const dateOptions = [-->
<!--  {label: "Equal To", value: "EqualTo"},-->
<!--  {label: "Not Equal To", value: "NotEqualTo"},-->
<!--  {label: "Greater Than", value: "GreaterThan"},-->
<!--  {label: "Less Than", value: "LessThan"},-->
<!--  {label: "Greater Than or Equal To", value: "GreaterOrEqual"},-->
<!--  {label: "Less Than or Equal To", value: "LessOrEqual"},-->
<!--  {label: "Is Null", value: "isNull"},-->
<!--  {label: "Is Not Null", value: "isNotNull"},-->
<!--]-->

<!--</script>-->

<!--<template>-->
<!--  <q-card style="width: 700px; max-width: 80vw;">-->

<!--    <div class="q-pa-md row">-->
<!--      <q-item-section>-->
<!--        <q-item-label>Due Date</q-item-label>-->
<!--        <q-input-->
<!--          v-model="advancedOptions.dueDateValue"-->
<!--          clearable-->
<!--          label="Due Date"-->
<!--          outlined-->
<!--          type="date"-->
<!--        />-->
<!--        <q-select v-model="advancedOptions.dueDateOption" :options="dateOptions"/>-->
<!--      </q-item-section>-->

<!--      <q-item-section>-->
<!--        <q-item-label>Modified Date</q-item-label>-->
<!--        <q-input-->
<!--          v-model="advancedOptions.modifiedDateValue"-->
<!--          clearable-->
<!--          label="Modified Date"-->
<!--          outlined-->
<!--          type="date"-->
<!--        />-->
<!--        <q-select v-model="advancedOptions.modifiedDateOption" :options="dateOptions"/>-->
<!--      </q-item-section>-->
<!--    </div>-->

<!--    <q-card-actions>-->
<!--      <q-btn v-close-popup color="primary" label="Save"/>-->
<!--    </q-card-actions>-->
<!--  </q-card>-->

<!--</template>-->

<!--<style scoped>-->
<!--.select-spacing {-->
<!--  margin: 5px; /* Adjust the margin as needed */-->
<!--}-->
<!--</style>-->
