<script setup>
import { onBeforeMount, ref, computed } from 'vue';
import { useTimesheetWorkFlowStore } from 'src/stores/timesheet/TimesheetWorkFlow';

const workFlowModel = ref('');
const timesheetWorkFlowStore = useTimesheetWorkFlowStore();
onBeforeMount(() => {
  timesheetWorkFlowStore.getTimesheetWorkFlow();
});
const workFlowUsers = computed(() => {
  return timesheetWorkFlowStore.WorkFlowUsers;
});
const workFlow = computed(() => {
  return timesheetWorkFlowStore.TimesheetWorkFlow;
});
const submitToUserId = workFlow.value?.submitToUserId;
const approveToUserId = workFlow.value?.approveToUserId;
const rejectToUserId = workFlow.value?.rejectToUserId;

const submitToUserName = computed(() => {
  return workFlowUsers.value?.find((x) => x.id === submitToUserId);
});
const approveToUserName = computed(() => {
  return workFlowUsers.value?.find((x) => x.id === approveToUserId);
});
const rejectToUserName = computed(() => {
  return workFlowUsers.value?.find((x) => x.id === rejectToUserId);
});
</script>
<template>
  <div class="row items-center justify-center q-my-md">
    <q-item-label caption> Submit To: </q-item-label>
    <q-item-label
      v-if="workFlow?.workflowType == 'auto'"
      class="q-mb-xs q-ml-sm"
    >
      {{ submitToUserName?.name }}
    </q-item-label>
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
