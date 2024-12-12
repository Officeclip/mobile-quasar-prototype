<script lang="ts" setup>
import { ref, Ref, defineProps, onBeforeMount, computed } from 'vue';
import { useIssueListsStore } from 'stores/issueTracker/issueListsStore';
import { trackerCaseDetails } from 'src/models/issueTracker/trackerCaseDetails';
import OCItem from '../../components/OCcomponents/OC-Item.vue';
import Regarding from 'components/general/regardingComponent.vue';

const props = defineProps({
  issueFromParent: {
    type: Object,
  },
  appName: {
    type: String,
  },
});

const trackerCaseDetail: Ref<trackerCaseDetails> = ref(props.issueFromParent);

const issueListsStore = useIssueListsStore();

onBeforeMount(async () => {
  await issueListsStore.getTrackerLists(
    props.issueFromParent?.binderId.toString()
  );
});

const regarding = computed(() => {
  return `${props.issueFromParent?.parent.type.name} : ${props.issueFromParent?.parent.value.name}`;
});
</script>
<template>
  <q-item>
    <q-item-section>
      <q-item-label>
        <q-input label="Title" v-model="trackerCaseDetail.name" />
      </q-item-label>
      <q-item-label>
        <q-field
          v-model="trackerCaseDetail.description"
          label-slot
          borderless
          ref="descriptionRef"
        >
          <template #label>Description</template>
          <template #control>
            <q-editor
              paragraph-tag="div"
              placeholder="enter description"
              min-height="5rem"
              class="q-mt-md full-width"
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
            ></q-editor>
          </template>
        </q-field>
      </q-item-label>
      <q-item-label>
        <q-select
          label="Status"
          v-model="trackerCaseDetail.status"
          :options="issueListsStore.Status"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Category"
          v-model="trackerCaseDetail.category"
          :options="issueListsStore.Category"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Assigned To"
          v-model="trackerCaseDetail.assignedTo"
          :options="issueListsStore.Users"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Criticality"
          v-model="trackerCaseDetail.criticality"
          :options="issueListsStore.Criticality"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Kind"
          v-model="trackerCaseDetail.kind"
          :options="issueListsStore.Kind"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-label>
      <q-item-label>
        <q-item>
          <Regarding
            v-if="appName === 'issueTracker'"
            v-model="trackerCaseDetail.parent"
            :regarding-parents="issueListsStore.RegardingParent"
        /></q-item>
        <OCItem
          v-if="
            appName !== 'issueTracker' && issueFromParent?.parent?.value?.name
          "
          title="Regarding"
          :value="regarding"
        />
      </q-item-label>
      <q-item-label>
        <q-input label="Comments" v-model="trackerCaseDetail.comments" />
      </q-item-label> </q-item-section
  ></q-item>
</template>
