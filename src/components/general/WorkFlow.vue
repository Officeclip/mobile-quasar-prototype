<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWorkFlowStore } from 'src/stores/workFlow/WorkFlow';
import { useTECommentsStore } from 'src/stores/TECommentsStore';
import { useQuasar } from 'quasar';

const props = defineProps(['entityId', 'entityType', 'stageId', 'employeeId']);
const $q = useQuasar();
const router = useRouter();
const showConfirmationDialog = ref(false);
const password = ref('');
const workFlowModel = ref('');
const workFlowStore = useWorkFlowStore();
const teCommentsStore = useTECommentsStore();

onBeforeMount(async () => {
  try {
    await workFlowStore.getWorkFlow(
      props?.entityId,
      props?.entityType,
      props?.stageId
    );
    await teCommentsStore.getTimesheetGroupProfile();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/timesheetsAll' });
    });
  }
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

const timesheetDCAA = computed(() => {
  return teCommentsStore.DCAA;
});

const upDateWorkFlow = async () => {
  if (
    props?.entityType == 'timesheet' &&
    timesheetDCAA.value.isEnabled &&
    timesheetDCAA.value.isConfirmationRequiredToSubmit &&
    props.stageId === 1
  ) {
    showConfirmationDialog.value = true;
  } else {
    try {
      await workFlowStore.submitWorkFlow(workFlow.value);
      router.go(-1);
    } catch (error) {
      $q.dialog({
        title: 'Alert',
        message: error as string,
      });
    }
  }
};

const teDCAAupdateWorkflow = async () => {
  workFlow.value.password = password.value;
  try {
    await workFlowStore.submitWorkFlow(workFlow.value);
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  }
};

const setApproveToUserId = computed(() => {
  return workFlow.value.approveToUserId === null
    ? props?.employeeId
    : workFlow.value.approveToUserId;
});

const manualWorkflow = (newValue: string) => {
  workFlow.value.submitToUserId = newValue;
  workFlow.value.stageId = props.stageId;
  workFlow.value.approveToUserId = '';
  workFlow.value.rejectToUserId = '';
  workFlow.value.users = null;
};

const submitButtonWorkFlow = () => {
  workFlow.value.stageId = props.stageId;
  workFlow.value.approveToUserId = '';
  workFlow.value.rejectToUserId = '';
  workFlow.value.users = null;
  upDateWorkFlow();
};
const approveButtonWorkFlow = () => {
  workFlow.value.stageId = props.stageId;
  workFlow.value.submitToUserId = '';
  workFlow.value.rejectToUserId = '';
  workFlow.value.approveToUserId = setApproveToUserId?.value;
  workFlow.value.users = null;
  upDateWorkFlow();
};
const rejectButtonWorkFlow = () => {
  workFlow.value.stageId = props.stageId;
  workFlow.value.submitToUserId = '';
  workFlow.value.approveToUserId = '';
  workFlow.value.users = null;
  upDateWorkFlow();
};

const closePopUp = () => {
  showConfirmationDialog.value = false;
};
</script>
<template>
  <div>
    <q-banner class="q-mb-md bg-grey-4" dense>
      <!-- <template v-slot:avatar>
        <q-icon name="info" />
      </template> -->
      <div>
        <q-item>
          <q-item-section
            ><q-item-label class="text-h6"
              >Workflow Information <q-icon name="info"
            /></q-item-label>
            <q-item-label>
              Your workflow is set to
              <span class="text-subtitle1">{{ submitToUserName?.name }}</span>
              ({{ workFlow?.workflowType }}), please click the button to submit,
            </q-item-label></q-item-section
          >
          <q-item-section side
            ><q-btn
              icon="send"
              color="primary"
              flat
              round
              dense
              @click="
                () => {
                  /* your action here */
                }
              " /></q-item-section
        ></q-item>
      </div>
      <!-- <div v-if="workFlow?.submitToUserId">
        <q-btn
          class="q-px-sm"
          no-caps
          dense
          color="primary"
          label="Submit"
          @click="submitButtonWorkFlow"
        />
        <q-item-label> to: {{ submitToUserName?.name }} </q-item-label>
      </div> -->
    </q-banner>
  </div>
  <div class="q-mt-sm">
    <!-- if submitToUserId there then this will comes up -->
    <div
      v-if="workFlow?.workflowType == 'auto'"
      class="row items-center justify-center"
    >
      <div v-if="workFlow?.submitToUserId">
        <q-btn
          class="q-px-sm"
          no-caps
          dense
          color="primary"
          label="Submit"
          @click="submitButtonWorkFlow"
        />
        <q-item-label> to: {{ submitToUserName?.name }} </q-item-label>
      </div>
      <div v-if="workFlow?.approveToUserId">
        <q-btn
          no-caps
          class="q-px-sm q-mx-sm"
          dense
          color="primary"
          label="Approve"
          @click="approveButtonWorkFlow"
        />
        <q-item-label class="q-mx-sm"
          >to: {{ approveToUserName?.name }}</q-item-label
        >
      </div>
      <div v-if="workFlow?.rejectToUserId">
        <q-btn
          no-caps
          class="q-px-sm q-mx-sm"
          dense
          color="negative"
          label="Reject"
          @click="rejectButtonWorkFlow"
        />
        <q-item-label class="q-mx-sm"
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
        @update:model-value="(newValue: any) => manualWorkflow(newValue)"
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
      <q-btn
        no-caps
        class="q-px-sm q-mx-sm"
        dense
        color="primary"
        label="Approve"
        @click="approveButtonWorkFlow"
      />
    </div>
  </div>
  <div>
    <q-dialog v-model="showConfirmationDialog">
      <q-card>
        <q-card-section>
          <h6 class="q-my-lg">Enter Password</h6>
          <input
            type="password"
            v-model="password"
            placeholder="Enter Password"
          />
          <button class="q-mx-sm" @click="teDCAAupdateWorkflow">Submit</button>
          <button @click="closePopUp">Cancel</button>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
