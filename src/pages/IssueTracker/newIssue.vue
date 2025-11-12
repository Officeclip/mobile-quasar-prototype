<script setup lang="ts">
import { ref, Ref } from 'vue';
import issueTrackerForm from '../../components/IssueTracker/IssueTrackerFormCtrl.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';
import { useIssueDetailsStore } from 'src/stores/issueTracker/issueDetailsStore';
import { useRoute, useRouter } from 'vue-router';
import { trackerCaseDetails } from 'src/models/issueTracker/trackerCaseDetails';

const router = useRouter();
const route = useRoute();
const binderId = route.params.binderId;

const parentObjectId = route.params.objectId ? route.params.objectId : '';
const parentObjectServiceType = route.params.objectTypeId
  ? route.params.objectTypeId
  : '';

const appName = route.params.appName.toString()
  ? route.params.appName.toString()
  : '';

const newIssue: Ref<trackerCaseDetails> = ref({
  id: '',
  binderId: binderId as string,
  caseId: '',
  name: '',
  status: { id: '', name: '--Select--', is_default: false },
  criticality: { id: '', name: '--Select--', is_default: false },
  category: { id: '', name: '--Select--', is_default: false },
  kind: { id: '', name: '--Select--', is_default: false },
  assignedTo: { id: '', name: '--Select--', email: '' },
  parent: {
    type: {
      id: parentObjectServiceType as string,
      name: '',
    },
    value: {
      id: parentObjectId as string,
      name: '',
    },
  },
  createdDate: '',
  createdUserName: '',
  modifiedDate: '',
  modifiedUserName: '',
  description: '',
  resolution: '',
  comments: '',
  security: { read: false, write: false, append: false, delete: false },
});

const issueDetailsStore = useIssueDetailsStore();

function onSubmit() {
  const issueFormCtrlValues = ref(newIssue);
  issueDetailsStore.addNewTrackerCaseDetails(issueFormCtrlValues.value);
  router.go(-1);
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      title="New Issue"
      :show-save-button="true"
      @save="onSubmit"
    ></OC_Header>
    <q-page-container>
      <q-page>
        <q-list>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <issueTrackerForm :issueFromParent="newIssue" :appName="appName" />
            <!-- <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            ></q-btn> -->
          </q-form>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
