<script setup lang="ts">
import { onBeforeMount, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useWorkFlowStore } from 'src/stores/workFlow/WorkFlow';
// import { useTECommentsStore } from 'src/stores/TECommentsStore';
import { useQuasar } from 'quasar';

const props = defineProps([
  'entityId',
  'entityType',
  'stageId',
  'employeeId',
  'groupProfileInfo',
]);
const $q = useQuasar();
const router = useRouter();
const showConfirmationDialog = ref(false);
const comments: any = ref(''); //for timeoff approve or reject comments
const showCommentsDialog = ref(false); //for timeoff approve or reject comments
const password = ref('');
const workFlowModel = ref('');
const workFlowStore = useWorkFlowStore();
// const teCommentsStore = useTECommentsStore();
const buttonObj = ref({
  name: '',
  icon: '',
  color: '',
});

onBeforeMount(async () => {
  try {
    await workFlowStore.getWorkFlow(
      props?.entityId,
      props?.entityType,
      props?.stageId
    );
    // await teCommentsStore.getTimesheetGroupProfile();
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
  return props?.groupProfileInfo;
});

// const timesheetDCAA = computed(() => {
//   return teCommentsStore.DCAA;
// });

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

const approveWorkflow = () => {
  workFlow.value.stageId = props.stageId;
  workFlow.value.submitToUserId = '';
  workFlow.value.rejectToUserId = '';
  workFlow.value.approveToUserId = setApproveToUserId?.value;
  workFlow.value.users = null;
  upDateWorkFlow();
};

const rejectWorkflow = () => {
  workFlow.value.stageId = props.stageId;
  workFlow.value.submitToUserId = '';
  workFlow.value.approveToUserId = '';
  workFlow.value.users = null;
  upDateWorkFlow();
};

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
  if (props?.entityType == 'timeOff') {
    buttonObj.value.name = 'Approve';
    buttonObj.value.icon = 'thumb_up';
    buttonObj.value.color = 'positive';
    showCommentsDialog.value = true;
  } else {
    // workFlow.value.stageId = props.stageId;
    // workFlow.value.submitToUserId = '';
    // workFlow.value.rejectToUserId = '';
    // workFlow.value.approveToUserId = setApproveToUserId?.value;
    // workFlow.value.users = null;
    // upDateWorkFlow();
    approveWorkflow();
  }
};
const submitComments = (isButton: any) => {
  if (isButton === 'Reject' && comments.value === '') {
    $q.dialog({
      title: 'Alert',
      message: 'Please enter comments',
    });
  } else {
    workFlow.value.comments = comments.value;
    if (isButton === 'Approve') {
      approveWorkflow();
    } else {
      rejectWorkflow();
    }
  }
};
const rejectButtonWorkFlow = () => {
  if (props?.entityType == 'timeOff') {
    buttonObj.value.name = 'Reject';
    buttonObj.value.icon = 'thumb_down';
    buttonObj.value.color = 'negative';
    showCommentsDialog.value = true;
  } else {
    // workFlow.value.stageId = props.stageId;
    // workFlow.value.submitToUserId = '';
    // workFlow.value.approveToUserId = '';
    // workFlow.value.users = null;
    // upDateWorkFlow();
    rejectWorkflow();
  }
};

const closePopUp = () => {
  comments.value = '';
  showCommentsDialog.value = false;
};
</script>
<template>
  <div v-if="workFlow?.workflowType == 'auto'">
    <q-banner class="q-mb-md bg-grey-4" dense>
      <div>
        <q-item>
          <q-item-section
            ><q-item-label class="text-h6 row items-center"
              ><q-icon name="info" class="q-mr-sm" />Workflow Info:
            </q-item-label>
            <!-- this is shownup on the screen in the timesheet and expenses only be'se there is no stage-1 in timeoff -->
            <q-item-label
              v-if="props?.stageId == 1 && workFlow?.workflowType === 'auto'"
            >
              Your workflow is set to
              <span class="text-subtitle1 text-weight-medium">{{
                submitToUserName?.name
              }}</span
              >, please submit the <span>{{ props?.entityType }}</span> to the
              next stage,
            </q-item-label>

            <q-item-label v-else>
              <span class="text-subtitle1 text-weight-medium">{{
                rejectToUserName?.name
              }}</span>
              has submitted
              <span>{{ props?.entityType }}</span
              >, please approve or reject,
            </q-item-label>
          </q-item-section>
          <q-item-section side
            ><q-btn
              v-if="workFlow?.submitToUserId"
              icon="send"
              color="primary"
              flat
              size="16px"
              round
              @click="submitButtonWorkFlow"
            />
            <q-btn
              v-if="workFlow?.approveToUserId"
              icon="check_circle"
              color="positive"
              flat
              size="16px"
              round
              @click="approveButtonWorkFlow"
            />
            <q-btn
              v-if="workFlow?.rejectToUserId"
              icon="cancel"
              color="negative"
              flat
              size="16px"
              round
              @click="rejectButtonWorkFlow"
            /> </q-item-section
        ></q-item>
      </div>
    </q-banner>
  </div>
  <!-- handling manual workflow -->
  <div v-else>
    <q-banner class="q-mb-md bg-grey-4" dense>
      <div>
        <q-item>
          <q-item-section
            ><q-item-label class="text-h6 row items-center"
              ><q-icon name="info" />Workflow Information
            </q-item-label>
            <q-item-label>
              Please approve the <span>{{ props?.entityType }}</span> or select
              a user from the dropdown menu to submit it to the next stage
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              icon="check_circle"
              color="primary"
              flat
              round
              dense
              @click="approveButtonWorkFlow"
            /> </q-item-section
        ></q-item>
        <q-item>
          <q-item-section>
            <q-item-label style="width: 80%">
              <q-select
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
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              v-if="workFlow?.submitToUserId"
              icon="send"
              color="primary"
              flat
              round
              dense
              @click="submitButtonWorkFlow"
            />
          </q-item-section>
        </q-item>
      </div>
    </q-banner>
  </div>
  <!-- use this below commented code for switched into old workflow design -->
  <!-- <div class="q-mt-sm">
    if submitToUserId there then this will comes up
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

    if the workflow routing setup as manual this will come up
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
  </div> -->
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
          <button v-close-popup>Cancel</button>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- handling ask write comments while approve or reject the timeoff -->
    <q-dialog v-model="showCommentsDialog">
      <!-- <q-card>
        <q-card-section>
          <h6 class="q-my-lg">Enter Comments</h6>
          <q-input
            v-model="comments"
            placeholder="Enter Comments"
            type="textarea"
          />
          <q-btn
            flat
            no-caps
            v-close-popup
            color="primary"
            @click="submitComments(buttonObj)"
            >Submit
          </q-btn>
          <button v-close-popup>Cancel</button>
        </q-card-section>
      </q-card> -->

      <q-card bordered style="width: 80%">
        <q-toolbar>
          <q-avatar>
            <q-icon
              :name="buttonObj?.icon"
              size="md"
              :color="buttonObj?.color"
            />
          </q-avatar>

          <q-toolbar-title
            >{{ buttonObj?.name }} Time Off request</q-toolbar-title
          >

          <q-btn
            flat
            round
            dense
            icon="close"
            @click="closePopUp"
            v-close-popup
          ></q-btn>
        </q-toolbar>

        <q-card-section>
          <q-item-label>
            <q-input
              outlined
              v-model="comments"
              placeholder="Enter Comments"
              type="textarea"
              class="bg-grey-2"
            />
          </q-item-label>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            no-caps
            :label="buttonObj?.name"
            :color="buttonObj?.color"
            v-close-popup
            @click="submitComments(buttonObj?.name)"
          >
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
