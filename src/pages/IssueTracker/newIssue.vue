<script setup lang="ts">
import { ref, Ref } from 'vue';
import issueTrackerForm from '../../components/IssueTracker/IssueTrackerFormCtrl.vue';
import OCSaveButton from '../../components/OCcomponents/OC-SaveButton.vue';
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
  binderId: binderId,
  caseId: '',
  name: '',
  status: {
    id: '-1',
    name: '--select--',
  },
  criticality: {
    id: '-1',
    name: '--select--',
  },
  category: {
    id: '-1',
    name: '--select--',
  },
  kind: {
    id: '-1',
    name: '--select--',
  },
  assignedTo: {
    id: '',
    name: '--select--',
  },
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
  security: {},
});

const issueDetailsStore = useIssueDetailsStore();

function onSubmit() {
  const issueFormCtrlValues = ref(newIssue);
  issueDetailsStore.addNewTrackerCaseDetails(issueFormCtrlValues.value);
  router.go(0);
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          @click="router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> New Issue</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page>
        <q-list>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <issueTrackerForm :issueFromParent="newIssue" :appName="appName" />
            <q-btn
              label="Reset"
              type="reset"
              color="primary"
              flat
              class="q-ml-sm"
            ></q-btn>
          </q-form>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
