<script setup lang="ts">
import { ref, computed } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';

const props = defineProps(['event']);

const startDateTime = ref('');
const endDateTime = ref('');

// eslint-disable-next-line vue/no-setup-props-destructure
startDateTime.value = props.event.startDateTime;
// eslint-disable-next-line vue/no-setup-props-destructure
endDateTime.value = props.event.endDateTime;

const formattedStartDateTime = computed(() => {
  console.log('TestDuttaForm: allDay value:', props.event.isAllDayEvent);
  let dateValue = dateTimeHelper.extractDateFromUtc(startDateTime.value);
  let timeValue = dateTimeHelper.extractTimeFromUtc(startDateTime.value);
  if (props.event.isAllDayEvent) {
    return dateValue;
  } else {
    return `${dateValue} ${timeValue}`;
  }
});

const formattedStartDateTime2 =
  startDateTime.value
    ? formattedStartDateTime
    : startDateTime

const formattedEndDateTime = computed(() => {
  console.log('TestDuttaForm: allDay value:', props.event.isAllDayEvent);
  let dateValue = dateTimeHelper.extractDateFromUtc(endDateTime.value);
  let timeValue = dateTimeHelper.extractTimeFromUtc(endDateTime.value);
  if (props.event.isAllDayEvent) {
    return dateValue;
  } else {
    return `${dateValue} ${timeValue}`;
  }
});

const formattedEndDateTime2 =
  endDateTime.value
    ? formattedEndDateTime
    : endDateTime

const maskDateTime = computed(() => {
  if (props.event.isAllDayEvent) {
    return 'YYYY-MM-DD';
  } else {
    return 'YYYY-MM-DD HH:mm';
  }
});
</script>

<template>
  <!-- FIXME: remove the warning -->
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input
        name="eventName"
        v-model="event.eventName"
        label="Event Name"
        placeholder="enter event name"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']">
        </q-input>
        <q-input
        name="eventDescription"
        class="q-mt-none"
        v-model="event.eventDescription"
        label="Description"
        placeholder="enter description"></q-input>
        <q-input
        name="eventLocation"
        v-model="event.eventLocation"
        label="Location"
        placeholder="enter location"></q-input>
        <!-- <pre>{{ event.isAllDayEvent }}</pre> -->
        <!-- <q-select
        v-model="event.isAllDayEvent"
        :options="options"
        map-options
        emit-value
        label="All Day event" /> -->

        <q-toggle
        name="isAllDayEvent"
        :false-value= 'false'
        label="All Day Event"
        :true-value= 'true'
        color="primary"
        keep-color
        v-model="event.isAllDayEvent"></q-toggle>

        <q-input
        name="startDateTime"
        v-model="formattedStartDateTime2"
        label="Start Date">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="startDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.event.isAllDayEvent" v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-if="!props.event.isAllDayEvent" v-model="startDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
        name="endDateTime"
        v-model="formattedEndDateTime2"
        label="End Date">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="endDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.event.isAllDayEvent" v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="endDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <!-- <q-input filled v-model="newDateTime">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="startDate" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.event.isAllDayEvent" v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-time
                  v-model="startDateTime"
                  mask="YYYY-MM-DD HH:mm"
                  format24h
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input> -->

        <!-- <div class="row">
          <div class="col col-md-5">
            <q-input
              v-model="startDate"
              type="date"
              label="Start Date"
              placeholder="enter start date"
            ></q-input>
          </div>
          <div class="col col-md-2"></div>
          <div class="col col-md-5">
            <q-input
              v-if="hideTime"
              v-model="startTime"
              type="time"
              label="Start Time"
              placeholder="enter start time"
            ></q-input>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>
