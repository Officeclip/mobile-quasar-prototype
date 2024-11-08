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
import OCItem from '../../components/OCcomponents/OC-Item.vue';
import { isAllowed } from 'src/helpers/security';
import NoteList from '../../components/Notes/NotesListCtrl.vue';
import { ObjectType } from '../../helpers/util';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
//const id = route.params.id;
const id = ref<string | string[]>('0');
id.value = route.params.id;
const binderName = route.params.binderName;
const myDrawer = ref();
const appName = route.params.appName;

const notesCount = ref<any>('0');

const parent = ref({
  parentObjectId: id,
  parentObjectServiceType: ObjectType.Contact.toString(),
  selectedNoteBook: '',
});

const handleNoteCount = (value: string) => {
  notesCount.value = value;
};

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
const issueDetailsStore = useIssueDetailsStore();

onMounted(() => {
  issueDetailsStore.getTrackerCaseDetails(id.value);
});
const issueDetails = computed(() => {
  return issueDetailsStore?.IssueDetails;
});

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this item..?');

const issueDetailSid = ref('');
const showDeleteIssueDetail = ref(false);

const cancelConfirmation = () => {
  showDeleteIssueDetail.value = false;
};

const displayShowDeleteIssueDetail = (id: string) => {
  issueDetailSid.value = id;
  showDeleteIssueDetail.value = true;
};

const projectServiceItem = computed(() => {
  return `${issueDetails.value?.parent.type?.name} : ${issueDetails.value?.parent.value?.name}`;
});

const deleteIssueDetail = async (id: string) => {
  try {
    await issueDetailsStore.deleteTrackerCaseDetails(id);
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

const isAllowEdit = computed(() => {
  return isAllowed({
    security: { write: issueDetails.value?.security?.write },
  });
});

const isAllowDelete = computed(() => {
  return isAllowed({
    security: { delete: issueDetails.value?.security?.delete },
  });
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
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
          v-if="isAllowEdit"
          flat
          round
          dense
          color="white"
          icon="edit"
          :to="{
            name: 'editIssue',
            params: { id: id, appName: appName },
          }"
        ></q-btn>
        <q-btn
          v-if="isAllowDelete"
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
                  :class="getIssueTrackerLabelColor(issueDetails.status?.name)"
                >
                  <q-item-label class="q-px-xs">{{
                    issueDetails.status?.name
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
                    getIssueTrackerLabelColor(issueDetails.criticality?.name)
                  "
                >
                  <q-item-label class="q-px-xs">{{
                    issueDetails.criticality?.name
                  }}</q-item-label>
                </q-chip>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side>
                <q-item-label caption>Kind: </q-item-label>
                <q-chip
                  dense
                  :class="getIssueTrackerLabelColor(issueDetails.kind?.name)"
                >
                  <q-item-label class="q-px-xs">{{
                    issueDetails.kind?.name
                  }}</q-item-label>
                </q-chip>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>Assigned To: </q-item-label>
                <q-item-label
                  >{{ issueDetails.assignedTo?.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-separator spaced inset></q-separator>
            <OCItem
              v-if="issueDetails?.parent?.value?.id"
              title="Regarding"
              :value="projectServiceItem"
            >
            </OCItem>
            <q-separator
              spaced
              v-if="issueDetails?.parent?.value?.id"
            ></q-separator>
            <q-item>
              <q-item-section>
                <q-item-label caption>Description: </q-item-label>
                <q-item-label
                  ><div v-html="issueDetails?.description"></div>
                </q-item-label>
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
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              expand-separator
              expand-icon-class="text-primary"
              dense
            >
              <template v-slot:header>
                <q-item-section side>
                  <div class="row items-center">
                    <q-icon name="subject" size="sm"></q-icon>
                  </div>
                </q-item-section>
                <q-item-section> Notes ({{ notesCount.value }})</q-item-section>

                <q-item-section side>
                  <q-btn
                    :to="{
                      name: 'newNotes',
                      params: {
                        id: -1,
                        objectTypeId: ObjectType.Issues,
                        objectId: issueDetails?.id,
                      },
                    }"
                    size="sm"
                    flat
                    round
                    dense
                    icon="add"
                  >
                  </q-btn>
                </q-item-section>
              </template>
              <q-separator></q-separator>
              <NoteList @numberOfNotes="handleNoteCount" :params="parent" />
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
