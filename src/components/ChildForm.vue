<!-- Child form component -->
<script setup>
import { computed } from 'vue';
import dateTimeHelper from 'src/helpers/dateTimeHelper';
const props = defineProps(['testData']);
const mask = computed(() => {
  if (props.testData.isAllDay) {
    return 'YYYY-MM-DD';
  } else {
    return 'YYYY-MM-DD HH:mm';
  }
});
const startDateParsed = computed(() => {
  const data = props.testData?.startDate;
  const data2 = props.testData.isAllDay;
  return dateTimeHelper.formatDateandTimeFromUtc(data, data2);
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-list>
        <q-input name="name" type="text" label="Name" v-model="testData.name" />
        <q-input
          name="email"
          type="email"
          label="Email"
          v-model="testData.email"
        />
        <q-toggle
          v-model="testData.isAllDay"
          :false-value="false"
          :true-value="true"
          color="primary"
          dense
          keep-color
          label="All Day Event"
          left-label
          name="isAllDayEvent"
        />

        <q-input
          v-if="startDateParsed"
          v-model="testData.startDate"
          :rules="[(val) => !!val || 'Start Date is required']"
          hide-bottom-space
          label="Starts*"
          name="startDate"
          :model-value="startDateParsed"
        >
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date v-model="testData.startDate" :mask="mask">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.testData.isAllDay" v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-time
                  v-if="!props.testData.isAllDay"
                  v-model="testData.startDate"
                  :mask="mask"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-list>
    </div>
  </div>
</template>
