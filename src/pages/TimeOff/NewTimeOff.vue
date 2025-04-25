<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useTimeOffStore } from '../../stores/timeOff/timeOffStore';
import { useRouter } from 'vue-router';
import TimeOffForm from '../../components/TimeOff/TimeOffFormCtrl.vue';
import { useQuasar } from 'quasar';
import OCSubmitButton from 'src/components/OCcomponents/OC-SubmitButton.vue';
import { TimeOffDetails } from 'src/models/TimeOff/timeOffDetails';

const $q = useQuasar();
const router = useRouter();
const timeOffStore = useTimeOffStore();

// const timeOff: Ref<TimeOffDetails> = ref({} as TimeOffDetails);

// const childComponent = ref(null);

const timeOff: Ref<TimeOffDetails> = ref({
  id: '',
  description: '',
  startDate: new Date().toISOString().slice(0, 10),
  startTime: new Date().toISOString().slice(11, 16),
  endDate: new Date().toISOString().slice(0, 10),
  requestedFor: 'full_day', //full day, half day, hourly
  datesRequested: [],
  totalHours: Number(),
  totalDays: Number(),
  createdUserSid: '',
  createdDate: '',
  createdByUserName: '',
  payroll: {
    id: '',
    name: '',
  },
  comments: '',
  security: {},
});

const childComponent = ref<typeof TimeOffForm>();

async function onSubmit() {
  $q.loading.show();
  try {
    if (!childComponent.value || !childComponent.value.validateAll()) return;
    const newTimeOff = ref(timeOff.value);
    await timeOffStore.addTimeOffDetails(newTimeOff.value);
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  } finally {
    $q.loading.hide();
  }
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
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
        <q-toolbar-title> New TimeOff</q-toolbar-title>
        <OCSubmitButton @handleClick="onSubmit"></OCSubmitButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <!-- <pre>New Page::{{ timeOff }}</pre> -->
      <q-form @submit="onSubmit" class="q-gutter-md">
        <TimeOffForm v-if="timeOff" :timeOff="timeOff" ref="childComponent" />
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
