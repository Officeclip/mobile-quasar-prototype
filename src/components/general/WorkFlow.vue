<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWorkFlowStore } from 'src/stores/workFlow/WorkFlow';

const props = defineProps(['entityId', 'entityType', 'stageId']);

const router = useRouter();
const workFlowModel = ref('');
const workFlowStore = useWorkFlowStore();
onBeforeMount(() => {
  workFlowStore.getWorkFlow(props?.entityId, props?.entityType, props?.stageId);
});
const workFlowUsers = computed(() => {
  return workFlowStore.WorkFlowUsers;
});
const workFlow = computed(() => {
  return workFlowStore.WorkFlow;
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
  workFlowStore.submitWorkFlow(workFlow.value);
  router.go(-1);
};

const manualWorkflow = (newValue: string) => {
  workFlow.value.submitToUserId = newValue;
  workFlow.value.stageId = props.stageId;
  workFlow.value.approveToUserId = '';
  workFlow.value.rejectToUserId = '';
};

const submitButtonWorkFlow = () => {
  workFlow.value.stageId = props.stageId;
  workFlow.value.approveToUserId = '';
  workFlow.value.rejectToUserId = '';
  upDateWorkFlow();
};
const approveButtonWorkFlow = () => {
  workFlow.value.stageId = props.stageId;
  workFlow.value.submitToUserId = '';
  workFlow.value.rejectToUserId = '';
  upDateWorkFlow();
};
const rejectButtonWorkFlow = () => {
  workFlow.value.stageId = props.stageId;
  workFlow.value.submitToUserId = '';
  workFlow.value.approveToUserId = '';
  upDateWorkFlow();
};
</script>
<template>
  <div class="q-mt-sm">
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
          @click="submitButtonWorkFlow"
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
      <div>
        <q-btn
          no-caps
          class="q-px-sm q-mx-sm"
          dense
          color="primary"
          label="Approve"
          @click="approveButtonWorkFlow"
        />
        <q-item-label class="text-caption q-mx-sm"
          >to: {{ approveToUserName?.name }}</q-item-label
        >
      </div>
      <div>
        <q-btn
          no-caps
          class="q-px-sm q-mx-sm"
          dense
          color="negative"
          label="Reject"
          @click="rejectButtonWorkFlow"
        />
        <q-item-label class="text-caption q-mx-sm"
          >to: {{ rejectToUserName?.name }}</q-item-label
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
