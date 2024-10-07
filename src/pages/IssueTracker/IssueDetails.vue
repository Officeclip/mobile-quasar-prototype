<!-- cleaned up with google bard with minor correction -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import drawer from '../../components/drawer.vue';
import { useIssueTrackerStore } from 'src/stores/issueTracker/issueTrackerStore';
import dateTimeHelper from 'src/helpers/dateTimeHelper';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const title = route.params.binderName;
const myDrawer = ref();

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
const issueTrackerStore = useIssueTrackerStore();

onMounted(() => {
  issueTrackerStore.getIssueDetails();
});
const issueDetails = computed(() => {
  return issueTrackerStore?.IssueDetails;
});
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
        <q-toolbar-title> Binder: {{ title }} </q-toolbar-title>
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
        <q-btn flat round dense color="white" icon="delete"></q-btn>
      </q-toolbar>
    </q-header>
    <drawer ref="myDrawer" />
    <q-space class="q-mt-sm"></q-space>
    <q-page-container>
      <q-page>
        <q-card>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label
                  ><span class="text-subtitle1 text-weight-medium"
                    >{{ issueDetails?.issueId }}:</span
                  >
                  <span class="xyz"
                    >{{ issueDetails?.name }}
                  </span></q-item-label
                >
              </q-item-section>
              <q-item-section side>
                <q-chip dense outline>
                  <q-item-label caption class="q-px-xs">{{
                    issueDetails.status
                  }}</q-item-label>
                </q-chip>
              </q-item-section>
            </q-item>
            <q-separator spaced inset></q-separator>
            <q-item>
              <q-item-section>
                <q-item-label caption>Assigned To: </q-item-label>
                <q-item-label>{{ issueDetails?.assignedTo }} </q-item-label>
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
</template>
<style scopped>
.xyz {
  line-height: 1.75rem;
  letter-spacing: 0.00937em;
}
</style>
