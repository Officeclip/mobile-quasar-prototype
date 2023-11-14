<script setup>
import { onMounted, ref, computed } from 'vue';
import { useTimesheetWorkFlowStore } from 'src/stores/timesheet/TimesheetWorkFlow';

const workFlowModel = ref('');
const timesheetWorkFlowStore = useTimesheetWorkFlowStore();
onMounted(() => {
  timesheetWorkFlowStore.getTimesheetWorkFlow();
});
const workFlowUsers = computed(() => {
  return timesheetWorkFlowStore.WorkFlowUsers;
});
const workFlow = computed(() => {
  return timesheetWorkFlowStore.workFlow;
});
</script>
<template>
  <div class="row items-center justify-center q-my-md">
    <q-item-label caption> Submit To: </q-item-label>
    <q-select
      v-if="workFlow.workflowType == 'manual'"
      class="q-mx-md"
      style="min-width: 160px"
      outlined
      dense
      v-model="workFlowModel"
      :options="workFlowUsers"
      option-label="name"
      map-options
      emit-value
    />
    <q-btn
      v-if="workFlowModel"
      no-caps
      class="q-px-sm"
      dense
      color="primary"
      label="Submit"
    />
  </div>
</template>
