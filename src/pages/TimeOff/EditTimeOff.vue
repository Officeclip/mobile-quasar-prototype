<script setup lang="ts">
import { onMounted, computed, ref, Ref } from 'vue';
import { useTimeOffStore } from '../../stores/timeOff/timeOffStore';
import { useRouter, useRoute } from 'vue-router';
import TimeOffForm from '../../components/TimeOff/TimeOffFormCtrl.vue';
import { useQuasar } from 'quasar';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';
import { TimeOffDetails } from 'src/models/TimeOff/timeOffDetails';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const timeOffStore = useTimeOffStore();

const timeOffSid = route.params.id;

const timeOff: Ref<TimeOffDetails> = ref(null);

onMounted(async () => {
  try {
    await timeOffStore.getTimeOffDetails(timeOffSid);
    const response = timeOffStore.TimeOffDetail;
    timeOff.value = response;
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/timesheetsAll' });
    });
  }
});

const childComponent = ref(null);

async function onSubmit() {
  try {
    if (!childComponent.value.validateAll()) return;
    const editTimeOff = ref(timeOff.value);
    await timeOffStore.editTimeOff(editTimeOff.value);
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
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
        <q-toolbar-title> Edit TimeOff</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <TimeOffForm v-if="timeOff" :timeOff="timeOff" ref="childComponent" />
      </q-form>
    </q-page-container>
  </q-layout>
</template>

<style></style>
