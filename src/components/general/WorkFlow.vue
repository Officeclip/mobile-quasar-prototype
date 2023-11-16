<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTimesheetWorkFlowStore } from 'src/stores/timesheet/TimesheetWorkFlow';

const router = useRouter();
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

const submitToUserId = computed(() => {
  return workFlow.value?.submitToUserId;
});
const approveToUserId = computed(() => {
  return workFlow.value?.approveToUserId;
});
const rejectToUserId = computed(() => {
  return workFlow.value?.rejectToUserId;
});
const submitToUserName = computed(() => {
  return workFlowUsers.value?.find(
    (x: { id: string }) => x.id === submitToUserId.value
  );
});
const approveToUserName = computed(() => {
  return workFlowUsers.value?.find(
    (x: { id: string }) => x.id === approveToUserId.value
  );
});
const rejectToUserName = computed(() => {
  return workFlowUsers.value?.find(
    (x: { id: string }) => x.id === rejectToUserId.value
  );
});

const upDateWorkFlow = () => {
  // const newWorkFlow =
  timesheetWorkFlowStore.submitWorkFlow(workFlow.value);
  router.go(-1);
};

const newWorkflow = (newValue: string) => {
  workFlow.value.submitToUserId = newValue;
  workFlow.value.approveToUserId = '';
  workFlow.value.rejectToUserId = '';
};
</script>
<template>
  <div class="q-mt-md">
    <!-- if submitToUserId there then it comes up -->
    <div
      v-if="workFlow?.submitToUserId"
      class="row items-center justify-center"
    >
      <div>
        <q-btn class="q-px-sm" no-caps dense color="primary" label="Submit" />
        <q-item-label class="text-caption">
          to: {{ submitToUserName?.name }}
        </q-item-label>
      </div>
    </div>

    <!-- if workflow routing setup as automatic this will comes up -->
    <div
      v-if="workFlow?.workflowType == 'auto'"
      class="row items-center justify-center"
    >
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

    <!-- if the workflow routing setup as manual this will come up -->
    <div
      v-if="workFlow?.workflowType == 'manual'"
      class="row items-center justify-center"
    >
      <pre>{{ workFlow }}</pre>
      <pre>{{ workFlowModel }}</pre>
      <q-item-label caption> Submit To: </q-item-label>

      <q-select
        style="min-width: 160px"
        outlined
        dense
        label="Select user"
        v-model="workFlowModel"
        :options="workFlowUsers"
        option-label="name"
        option-value="id"
        map-options
        emit-value
        @update:model-value="(newValue) => newWorkflow(newValue)"
      />
      <q-btn
        v-if="workFlowModel"
        class="q-mx-md q-px-sm"
        no-caps
        dense
        color="primary"
        label="Submit"
        @click="upDateWorkFlow"
      />
    </div>
  </div>
</template>
