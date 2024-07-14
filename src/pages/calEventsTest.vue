<script lang="ts" setup>
import { ref, watch } from 'vue';
import dateTimeHelper from '../helpers/dateTimeHelper';

const isAllDayEvent = ref(false);

const start = ref('2024-04-10T11:50:07Z');
const startsModelValue = ref();
startsModelValue.value = dateTimeHelper.formatDateandTimeFromUtc(
  start.value,
  isAllDayEvent.value
);
const dateTimeMask = 'ddd, MMM D, YYYY hh:mm A';
const dateMask = 'ddd, MMM D, YYYY';
const mask = (x: boolean) => {
  return x ? dateMask : dateTimeMask;
};
watch(isAllDayEvent, () => {
  startsModelValue.value = dateTimeHelper.formatDateandTimeFromUtc(
    start.value,
    isAllDayEvent.value
  );
});
</script>

<template>
  <div id="q-app" style="min-height: 100vh">
    <div class="q-pa-md" style="min-width: 500px">
      <pre>startsModelValue: {{ startsModelValue }}</pre>
      <pre>isAllDayEvent: {{ isAllDayEvent }}</pre>
      <pre>mask: {{ mask(isAllDayEvent) }}</pre>
      <q-item>
        <q-toggle
          v-model="isAllDayEvent"
          :false-value="false"
          :true-value="true"
          color="primary"
          dense
          keep-color
          label="All Day Event"
          left-label
        />
      </q-item>
      <q-item>
        <q-input
          style="min-width: 400px !important"
          v-model="startsModelValue"
          label="Starts*"
        >
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date v-model="startsModelValue" :mask="mask(isAllDayEvent)">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!isAllDayEvent" v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-time v-model="startsModelValue" :mask="mask(isAllDayEvent)">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template> </q-input
      ></q-item>
    </div>
  </div>
</template>
