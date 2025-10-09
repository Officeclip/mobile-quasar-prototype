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
    model: 'status',
    options: issueListsStore.Status,
  },
  {
    label: 'Category',
    model: 'category',
    options: issueListsStore.Category,
  },
  {
    label: 'Assigned To',
    model: 'assignedTo',
    options: issueListsStore.Users,
  },
  {
    label: 'Criticality',
    model: 'criticality',
    options: issueListsStore.Criticality,
  },
  {
    label: 'Kind',
    model: 'kind',
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
            <q-input label="Title" v-model="trackerCaseDetail.name" filled />
          </div>

          <div
            class="col-12 col-md-6"
            v-for="(field, index) in selectFields"
            :key="index"
          >
            <q-select
              :label="field.label"
              v-model="trackerCaseDetail[field.model]"
              :options="field.options"
              map-options
              option-label="name"
              option-value="id"
              filled
            />
          </div>

          <div class="col-12 col-md-6">
            <Regarding
              v-if="appName === 'issueTracker'"
              v-model="trackerCaseDetail.parent"
              :regarding-parents="issueListsStore.RegardingParent"
              class="col-md-6"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input
              label="Comments"
              v-model="trackerCaseDetail.comments"
              filled
              class="q-mt-md"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-field
              v-model="trackerCaseDetail.description"
              label-slot
              borderless
              class="q-mb-md"
            >
              <template #label>Description</template>
              <template #control>
                <q-editor
                  class="col-12 q-mt-md"
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
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
