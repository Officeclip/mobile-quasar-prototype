<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import drawer from '../../components/drawer.vue';
import { useIssueDetailsStore } from 'src/stores/issueTracker/issueDetailsStore';
import dateTimeHelper from 'src/helpers/dateTimeHelper';
import { useRoute, useRouter } from 'vue-router';
import { getIssueTrackerLabelColor } from 'src/helpers/colorIconHelper';
import ConfirmDelete from '../../components/general/ConfirmDelete.vue';
import logger from 'src/helpers/logger';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const binderName = route.params.binderName;
const myDrawer = ref();

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
const issueDetailsStore = useIssueDetailsStore();

onMounted(() => {
  issueDetailsStore.getIssueDetails();
});
const issueDetails = computed(() => {
  return issueDetailsStore?.IssueDetails;
});

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this timesheet?');

const issueDetailSid = ref('');
const showDeleteIssueDetail = ref(false);

const cancelConfirmation = () => {
  showDeleteIssueDetail.value = false;
};

const displayShowDeleteIssueDetail = (id: string) => {
  issueDetailSid.value = id;
  showDeleteIssueDetail.value = true;
};

const deleteIssueDetail = async (id: string) => {
  try {
    await issueDetailsStore.deleteIssueDetails(id);
    showDeleteIssueDetail.value = false;
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      logger.log('*** Delete timesheetDetail:onSubmit(...):onOK ***');
      showDeleteIssueDetail.value = false;
    });
  }
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          @click="router.push({ path: '/binders' })"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Binder: {{ binderName }} </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          color="white"
          icon="edit"
          :to="{
            name: 'editIssue',
          }"
        ></q-btn>
        <q-btn
          flat
          round
          dense
          color="white"
          icon="delete"
          @click="displayShowDeleteIssueDetail(issueDetails?.id)"
        ></q-btn>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-space class="q-mt-sm"></q-space>
    <q-page-container class="q-mb-md">
      <q-page>
        <q-card>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label
                  ><span class="text-subtitle1 text-weight-medium"
                    >{{ issueDetails?.caseId }}:</span
                  >
                  <span class="description"
                    >{{ issueDetails?.name }}
                  </span></q-item-label
                >
              </q-item-section>
            </q-item>
            <q-separator spaced inset></q-separator>
            <q-item>
              <q-item-section side>
                <q-item-label caption>Status: </q-item-label>
                <q-chip
                  dense
                  :class="getIssueTrackerLabelColor(issueDetails?.status.name)"
                >
                  <q-item-label class="q-px-xs">{{
                    issueDetails?.status.name
                  }}</q-item-label>
                </q-chip>
              </q-item-section>
              <!-- <q-item-section side>
                <q-item-label caption>Criticality: </q-item-label>
                <q-chip
                  dense
                  :class="getIssueTrackerLabelColor(issueDetails.criticality)"
                >
                  <q-item-label class="q-px-xs">{{
                    issueDetails.criticality
                  }}</q-item-label>
                </q-chip>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>Kind: </q-item-label>
                <q-chip
                  dense
                  :class="getIssueTrackerLabelColor(issueDetails.kind)"
                >
                  <q-item-label class="q-px-xs">{{
                    issueDetails.kind
                  }}</q-item-label>
                </q-chip>
              </q-item-section> -->
            </q-item>
            <q-item>
              <q-item-section side>
                <q-item-label caption>Criticality: </q-item-label>
                <q-chip
                  dense
                  :class="
                    getIssueTrackerLabelColor(issueDetails.criticality.name)
                  "
                >
                  <q-item-label class="q-px-xs">{{
                    issueDetails.criticality.name
                  }}</q-item-label>
                </q-chip>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-item-label caption>Kind: </q-item-label>
                <q-chip
                  dense
                  :class="getIssueTrackerLabelColor(issueDetails.kind.name)"
                >
                  <q-item-label class="q-px-xs">{{
                    issueDetails.kind.name
                  }}</q-item-label>
                </q-chip>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Assigned To: </q-item-label>
                <q-item-label
                  >{{ issueDetails?.assignedTo.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator spaced inset></q-separator>
            <q-item>
              <q-item-section>
                <q-item-label caption>Description: </q-item-label>
                <q-item-label>{{ issueDetails?.description }} </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator spaced inset></q-separator>
            <q-item>
              <q-item-section>
                <q-item-label caption>Created By: </q-item-label>
                <q-item-label
                  >{{ issueDetails?.createdUserName }} on
                  {{
                    dateTimeHelper.formatDateTimeFromRestAPIForUI(
                      issueDetails?.createdDate,
                      false
                    )
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator spaced inset></q-separator>
            <q-item>
              <q-item-section>
                <q-item-label caption>Modified By: </q-item-label>
                <q-item-label
                  >{{ issueDetails?.modifiedUserName }} on
                  {{
                    dateTimeHelper.formatDateTimeFromRestAPIForUI(
                      issueDetails?.modifiedDate,
                      false
                    )
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator spaced inset></q-separator>
          </q-list>
        </q-card>
        <q-card>
          <q-list>
            <q-expansion-item
              expand-separator
              expand-icon-class="text-primary"
              class="bg-white"
            >
              <template v-slot:header>
                <q-item-section>
                  <q-item-label>Notes (1) </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn size="sm" flat round dense icon="add"> </q-btn>
                </q-item-section>
              </template>
              <q-item>
                <q-item-section>
                  <q-item-label> Sample test notes here </q-item-label>
                </q-item-section>
              </q-item>
            </q-expansion-item>
          </q-list>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
  <ConfirmDelete
    v-if="showDeleteIssueDetail"
    :showConfirmationDialog="showDeleteIssueDetail"
    :id="issueDetailSid"
    :title="title"
    :message="message"
    @cancel="cancelConfirmation"
    @confirm="deleteIssueDetail"
  />
</template>
<style scopped lang="scss">
@import '../../css/status.scss';
.description {
  line-height: 1.75rem;
  letter-spacing: 0.00937em;
}
</style>
