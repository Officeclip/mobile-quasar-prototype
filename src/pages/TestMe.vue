<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSessionStore } from '../stores/SessionStore';
import ocSession from '../helpers/util.ts';
import { useTestDuttaStore } from '../stores/TestDuttaStore';

const testDuttaStore = useTestDuttaStore();
const sessionStore = useSessionStore();

const status = ref('open');

onMounted(() => {
  sessionStore.getSession();
  testDuttaStore.getDuttaTest();
});

const duttaValues = computed(() => {
  return testDuttaStore.TestDutta;
});

const expenseTypes = {
  id: 'J2BBXASXHAFW2ZSD2BKNWBGEB2LYYHFSGMJM6LQ',
  expenseTypeName: 'AIRFARE',
  expenseName: 'Air',
  isDetailsRequired: true,
  isBillable: true,
  isBillableModify: true,
};

const session = computed(() => {
  //return sessionStore.Session;
  return ocSession;
});

function getClass() {
  if (status.value == 'open') return 'status-open';
  return 'status-closed';
}

const newValue = ref(false);
newValue.value = expenseTypes.isBillable;

console.log('Testing IsBillableModify', expenseTypes.isBillableModify);
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <pre>DuttaValues: {{ duttaValues }}</pre>
  <div>
    <q-chip square :class="getClass()">{{ status }}</q-chip>
  </div>
  <div>
    <pre>Session xxx: {{ session }}</pre>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <!-- <pre> {{ expenseForm.description }} </pre> -->
        <!-- <q-input label="Description" v-model="expenseForm.description" placeholder="enter here..." lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Please type something']">
        </q-input> -->
        <!-- <q-select filled v-model="selectedItem" :options="billableOptions" label="Is Billable" emit-value map-options
          :disable="false" /> -->
        <q-toggle
          v-if="expenseTypes.isBillableModify === true"
          label="labelName"
          :false-value="false"
          :true-value="true"
          color="primary"
          keep-color
          v-model="newValue"
        ></q-toggle>
        <div v-else caption class="q-mb-md text-italic">
          <q-item-label class="q-mb-sm">
            {{ newValue }}
          </q-item-label>
          <q-icon name="hide_source" /> You do not permission to edit this item
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import '../css/status.scss';
</style>
