<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTimesheetWorkFlowStore } from 'src/stores/timesheet/TimesheetWorkFlow';

const props = defineProps(['entityId', 'entityType']);
// const entityId = props?.entityId;
// const entityType = props?.entityType;

const router = useRouter();
const workFlowModel = ref('');
const timesheetWorkFlowStore = useTimesheetWorkFlowStore();
onBeforeMount(() => {
  timesheetWorkFlowStore.getTimesheetWorkFlow(
    props?.entityId,
    props?.entityType
  );
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
  timesheetWorkFlowStore.submitWorkFlow(workFlow.value);
  router.go(-1);
};

const manualWorkflow = (newValue: string) => {
  workFlow.value.submitToUserId = newValue;
  workFlow.value.id = '';
  workFlow.value.approveToUserId = '';
  workFlow.value.rejectToUserId = '';
};

const submitButtonWorlFlow = () => {
  workFlow.value.id = '';
  workFlow.value.approveToUserId = '';
  workFlow.value.rejectToUserId = '';
  upDateWorkFlow();
};
const approveButtonWorlFlow = () => {
  workFlow.value.id = '';
  workFlow.value.submitToUserId = '';
  workFlow.value.rejectToUserId = '';
  upDateWorkFlow();
};
const rejectButtonWorlFlow = () => {
  workFlow.value.id = '';
  workFlow.value.submitToUserId = '';
  workFlow.value.approveToUserId = '';
  upDateWorkFlow();
};
</script>
<template>
  <div class="q-mt-md">
    <!-- if submitToUserId there then this will comes up -->
    <div
      v-if="workFlow?.submitToUserId && workFlow?.workflowType == 'auto'"
      class="row items-center justify-center"
    >
      <div>
        <q-btn
          class="q-px-sm"
          no-caps
          dense
          color="primary"
          label="Submit"
          @click="submitButtonWorlFlow"
        />
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
          @click="approveButtonWorlFlow"
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
          @click="rejectButtonWorlFlow"
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
      <q-select
        style="min-width: 160px"
        outlined
        dense
        label="Submit To:"
        v-model="workFlowModel"
        :options="workFlowUsers"
        option-label="name"
        option-value="id"
        map-options
        emit-value
        @update:model-value="(newValue) => manualWorkflow(newValue)"
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
