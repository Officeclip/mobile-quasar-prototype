<script setup>
import { ref, defineProps, onBeforeMount } from 'vue';
import { useIssueListsStore } from 'stores/issueTracker/issueListsStore';

const props = defineProps(['issueObject']);

const issueObjectModel = ref(props.issueObject);

const issueListsStore = useIssueListsStore();

onBeforeMount(async () => {
  await issueListsStore.getTrackerLists(props.issueObject.binderId);
  // try {
  //   await issueListsStore.getIssueLists();
  // } catch (error) {
  //   $q.dialog({
  //     title: 'Alert',
  //     message: error as string,
  //   }).onOk(async () => {
  //     await router.push({ path: '/issuesList' });
  //   });
  // }
});

// const statusOptions = ['Open', 'Closed', 'Reopened', 'Resolved'];
</script>
<template>
  <q-item>
    <q-item-section>
      <q-item-label>
        <q-input label="Title" v-model="issueObjectModel.name" />
      </q-item-label>
      <q-item-label>
        <q-field
          v-model="issueObjectModel.description"
          label-slot
          borderless
          ref="descriptionRef"
        >
          <template #label>Description</template>
          <template #control>
            <q-editor
              min-height="5rem"
              class="q-mt-md full-width"
              v-model="issueObjectModel.description"
              paragraph-tag="div"
              placeholder="enter description"
            ></q-editor>
          </template>
        </q-field>
      </q-item-label>
      <q-item-label>
        <q-select
          label="Status"
          v-model="issueObjectModel.status"
          :options="issueListsStore.Status"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Category"
          v-model="issueObjectModel.category"
          :options="issueListsStore.Category"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Assigned To"
          v-model="issueObjectModel.assignedTo"
          :options="issueListsStore.Users"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Criticality"
          v-model="issueObjectModel.criticality"
          :options="issueListsStore.Criticality"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-label>
      <q-item-label>
        <q-select
          label="Kind"
          v-model="issueObjectModel.kind"
          :options="issueListsStore.Kind"
          map-options
          option-label="name"
          option-value="id"
        />
      </q-item-label> </q-item-section
  ></q-item>
</template>
