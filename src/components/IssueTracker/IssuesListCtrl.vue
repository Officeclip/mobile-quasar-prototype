<script setup lang="ts">
import { computed, ref } from 'vue';
import { useIssueSummaryStore } from 'src/stores/issueTracker/issueSummaryStore';
import { useRoute, useRouter } from 'vue-router';
import dateTimeHelper from 'src/helpers/dateTimeHelper';
import { getIssueTrackerLabelColor } from 'src/helpers/colorIconHelper';
import { useQuasar } from 'quasar';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const props = defineProps(['parent']);
const binderName = route.params.binderName;
const binderId = route.params.binderId;

const issueSummaryStore = useIssueSummaryStore();

const issuesList = computed(() => {
  issueSummaryStore.$reset();
  return issueSummaryStore.IssuesList;
});

const errorMsg = computed(() => {
  return issueSummaryStore.errorMsg;
});

let reachedEnd = ref(false); // indicate if all contacts have been loaded
const loadMore = async (index: any, done: () => void) => {
  try {
    reachedEnd.value = await issueSummaryStore.getIssuesUpdated(
      false,
      binderId.toString()
    );
    //https://quasar.dev/vue-components/infinite-scroll/#usage
    done();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
};
</script>

<template>
  <q-item-section v-if="errorMsg !== ''">
    <div class="flex justify-center">
      <span class="text-subtitle1 text-weight-medium inline q-mr-xs">{{
        errorMsg
      }}</span>
    </div>
  </q-item-section>
  <q-infinite-scroll :disable="reachedEnd" @load="loadMore">
    <q-list v-for="issue in issuesList" :key="issue.id">
      <q-item
        clickable
        v-ripple
        :to="{
          name: 'trackerCaseDetails',
          params: {
            id: issue.id,
            binderId: binderId,
            appName: parent.appName,
          },
        }"
      >
        <q-item-section>
          <q-item-label class="ellipsis"
            ><span class="text-subtitle1 text-weight-medium inline q-mr-xs"
              >{{ issue.caseId }}:</span
            >
            <span v-html="issue?.name"></span
          ></q-item-label>
        </q-item-section>
        <q-item-section v-if="issue.status" side top>
          <q-chip dense :class="getIssueTrackerLabelColor(issue.status)">
            <q-item-label caption class="q-px-xs testClass">{{
              issue.status
            }}</q-item-label>
          </q-chip>
        </q-item-section>

        <q-item-section side>
          <q-icon color="primary" name="chevron_right" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div class="flex items-end justify-between ellipsis">
            <q-item-label v-if="issue.createdDate">
              <span class="text-caption">created:</span>
              <span class="q-mx-sm">{{
                dateTimeHelper.formatDateTimeFromRestAPIForUI(
                  issue.createdDate,
                  false
                )
              }}</span>
            </q-item-label>
            <q-item-label v-if="issue.assignedTo">
              <span class="text-caption">assigned:</span>
              <span class="q-mx-sm">{{ issue.assignedTo }}</span>
            </q-item-label>
          </div>
        </q-item-section>
      </q-item>
      <q-separator spaced inset></q-separator>
    </q-list>
  </q-infinite-scroll>
</template>

<style scopped lang="scss">
@import '../../css/status.scss';
.q-item {
  min-height: 24px;
  padding: 4px 16px;
}
.required {
  color: red;
}
</style>
