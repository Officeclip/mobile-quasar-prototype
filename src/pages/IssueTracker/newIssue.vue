<script setup lang="ts">
import { ref } from 'vue';
import issueTrackerForm from '../../components/IssueTracker/IssueTrackerFormCtrl.vue';
import OCSaveButton from '../../components/OCcomponents/OC-SaveButton.vue';
import { useIssueDetailsStore } from 'src/stores/issueTracker/issueDetailsStore';
import { useRouter } from 'vue-router';
import { issueDetails } from 'src/models/issueTracker/issueDetails';

const router = useRouter();
const newIssue: issueDetails = ref({
  description: '',
});

const issueDetailsStore = useIssueDetailsStore();

function onSubmit() {
  const issueFormCtrlValues = ref(newIssue);
  // console.log('Get the Issue From tracker form::', issueFormCtrlValues.value);
  issueDetailsStore.addNewIssue(issueFormCtrlValues.value);
  router.go(-2);
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
            <issueTrackerForm :issueObject="newIssue" />
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
