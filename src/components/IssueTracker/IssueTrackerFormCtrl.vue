<script lang="ts" setup>
import { ref, Ref, defineProps, onBeforeMount, computed } from 'vue';
import { useIssueListsStore } from '../../stores/issueTracker/issueListsStore';
import { trackerCaseDetails } from 'src/models/issueTracker/trackerCaseDetails';
import Regarding from 'components/general/regardingComponent.vue';

const props = defineProps({
  issueFromParent: {
    type: Object as () => trackerCaseDetails,
    required: true,
  },
  appName: {
    type: String,
  },
});

const trackerCaseDetail: Ref<trackerCaseDetails> = ref(props.issueFromParent);

const issueListsStore = useIssueListsStore();

onBeforeMount(async () => {
  if (props.issueFromParent?.binderId) {
    await issueListsStore.getTrackerLists(
      props.issueFromParent.binderId.toString(),
    );
  }
});

const selectFields = computed(() => [
  {
    label: 'Status',
    model: 'status' as keyof trackerCaseDetails,
    options: issueListsStore.Status,
  },
  {
    label: 'Category',
    model: 'category' as keyof trackerCaseDetails,
    options: issueListsStore.Category,
  },
  {
    label: 'Assigned To',
    model: 'assignedTo' as keyof trackerCaseDetails,
    options: issueListsStore.Users,
  },
  {
    label: 'Criticality',
    model: 'criticality' as keyof trackerCaseDetails,
    options: issueListsStore.Criticality,
  },
  {
    label: 'Kind',
    model: 'kind' as keyof trackerCaseDetails,
    options: issueListsStore.Kind,
  },
]);
</script>

<template>
  <div class="q-pa-md">
    <q-card flat>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              label="Title"
              v-model="trackerCaseDetail.name"
              filled
              class="full-width"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-field
              v-model="trackerCaseDetail.description"
              label="Description"
              filled
              stack-label
            >
              <template #control>
                <q-editor
                  class="full-width"
                  paragraph-tag="div"
                  placeholder="Enter description"
                  min-height="5rem"
                  v-model="trackerCaseDetail.description"
                  :toolbar="[
                    [
                      'link',
                      'bold',
                      'italic',
                      'unordered',
                      'ordered',
                      'fullscreen',
                    ],
                  ]"
                />
              </template>
            </q-field>
          </div>

          <div
            class="col-12 col-md-6"
            v-for="field in selectFields"
            :key="field.model"
          >
            <q-select
              :label="field.label"
              v-model="trackerCaseDetail[field.model]"
              :options="field.options"
              map-options
              option-label="name"
              option-value="id"
              filled
              class="full-width"
            />
          </div>

          <div class="col-12 col-md-6">
            <Regarding
              v-if="appName === 'issueTracker'"
              v-model="trackerCaseDetail.parent"
              :regarding-parents="issueListsStore.RegardingParent"
              class="full-width"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              label="Comments"
              v-model="trackerCaseDetail.comments"
              filled
              class="full-width"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
