<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import issueTrackerForm from '../../components/IssueTracker/IssueTrackerFormCtrl.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';
import { useRouter, useRoute } from 'vue-router';
import { useIssueDetailsStore } from 'src/stores/issueTracker/issueDetailsStore';
import { trackerCaseDetails } from 'src/models/issueTracker/trackerCaseDetails';

const router = useRouter();
const route = useRoute();
const issueDetailsStore = useIssueDetailsStore();

const id = route.params.id;
const appName = route.params.appName.toString();
const editIssue: Ref<trackerCaseDetails> = ref(null);

onMounted(async () => {
  await issueDetailsStore.getTrackerCaseDetails(id);
  const respone = issueDetailsStore.IssueDetails;
  editIssue.value = respone;
});

function onSubmit() {
  const trackerCaseDetails = ref(editIssue);
  issueDetailsStore.editTrackerCaseDetails(trackerCaseDetails.value);
  router.go(-2);
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      title="Edit Issue"
      :show-save-button="true"
      @save="onSubmit"
    ></OC_Header>
    <q-page-container>
      <q-page>
        <q-list>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <issueTrackerForm
              v-if="editIssue"
              :issueFromParent="editIssue"
              :appName="appName"
            />
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
