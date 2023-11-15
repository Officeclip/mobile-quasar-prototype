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

    <div v-if="workFlow?.workflowType == 'auto'">
      <q-item-label class="q-mb-xs q-ml-sm">
        {{ submitToUserName?.name }}
      </q-item-label>
      <div class="row">
        <div class="column">
          <q-btn
            no-caps
            class="q-px-sm q-mx-sm"
            dense
            color="primary"
            label="Approve"
          />
          <span class="q-mx-sm text-caption"
            >to: {{ approveToUserName?.name }}</span
          >
        </div>
        <div class="column">
          <q-btn
            no-caps
            class="q-px-sm q-mx-sm"
            dense
            color="negative"
            label="Reject"
          />
          <span class="q-mx-sm text-caption"
            >to: {{ rejectToUserName?.name }}</span
          >
        </div>
      </div>
    </div>
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
