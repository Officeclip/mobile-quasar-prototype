<!--
TODO: sg: Show the details of multi day event in the text(Event timing) [45]
-->
<script lang="ts" setup>
import { eventSummary } from '../../models/event/eventSummary';
import { useEventSummaryStore } from '../../stores/event/eventSummaryStore';
import { computed, onMounted, ref } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper.js';
import { format } from 'date-fns';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const eventSummaryStore = useEventSummaryStore();
const router = useRouter();
const $q = useQuasar();

const date = ref('');
date.value = format(new Date(), 'yyyy/MM/dd');

const yearAndMonth = ref(null);

onMounted(async () => {
  try {
    await eventSummaryStore.getAllEventSummary(null);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
});

const eventDates = computed(() => {
  return eventSummaryStore.getEventSummaryDates();
});

function getEventIcon(type: any) {
  if (type === 1) return 'groups'; // group event
  if (type === 2) return 'group'; // Personal
  return 'person'; // meetings
}

function getEventTypeColour(type: any) {
  if (type === 1) return 'red'; // group event
  if (type === 2) return 'secondary'; // personal
  return 'primary'; // meetings
}

const eventsForADay = computed(() => {
  const myEvents = eventSummaryStore.EventSummary; // FIXME: skd: Not implemented correctly... should be fixed! [45]
  if (myEvents.length === 0) {
    eventSummaryStore.getAllEventSummary(yearAndMonth.value);
  }
  let events = eventSummaryStore.getEventSummaryForADay(date.value);
  return events;
});

function getFromToDate(event: eventSummary) {
  const from = dateTimeHelper.extractTimeFromUtc(event.startDateTime as string);
  const to = dateTimeHelper.extractTimeFromUtc(event.endDateTime as string);
  return `${from} - ${to}`;
}

function getEventType(event: eventSummary) {
  const fromDate = dateTimeHelper.extractDateFromUtc(event.startDateTime);
  const toDate = dateTimeHelper.extractDateFromUtc(event.endDateTime);
  const time = getFromToDate(event);
  if (event.isAllDayEvent) {
    return 'All day event';
  }
  if (fromDate != toDate) {
    return `${fromDate} - ${toDate}`;
  } else {
    return time;
  }
}

const getYearandMonth = (newvalue: any) => {
  yearAndMonth.value = newvalue;
  eventSummaryStore.getAllEventSummary(yearAndMonth.value);
};
</script>
<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated height-hint="48">
      <q-toolbar>
        <q-btn color="white" dense flat icon="arrow_back" round @click="$router.go(-1)">
        </q-btn>
        <q-toolbar-title> OfficeClip Calendar</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <div class="q-ma-md">
          <q-list class="flex justify-center">
            <q-date v-model="date" :events="eventDates" today-btn @navigation="getYearandMonth" />
          </q-list>
          <q-list class="q-pt-lg text-h6">Events for: {{ date }}</q-list>
          <q-list bordered class="q-mt-sm">
            <q-item v-for="event in eventsForADay" :key="event.id" v-ripple :to="{
          name: 'eventDetails',
          params: { id: event.id },
        }" clickable>
              <q-item-section avatar>
                <q-icon :name="getEventIcon(event.eventType)" :color="getEventTypeColour(event.eventType)" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ event.eventName }}</q-item-label>
                <q-item-label caption lines="1">
                  {{ getEventType(event) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon color="primary" name="chevron_right" />
              </q-item-section>
            </q-item>
          </q-list>
          <q-list>
            <q-item class="flex items-center">Legends:
              <q-icon class="q-ml-md" color="primary" name="person" />
              <div class="q-ml-sm text-caption">Personal</div>
              <q-icon class="q-ml-md" color="secondary" name="group" />
              <div class="q-ml-sm text-caption">Meeting</div>
              <q-icon class="q-ml-md" color="red" name="groups" />
              <div class="q-ml-sm text-caption">Group</div>
            </q-item>
          </q-list>
          <q-page-sticky :offset="[18, 18]" position="bottom-right">
            <q-btn :to="{
          name: 'newEvent',
          params: {
            id: -1,
            objectTypeId: -1,
            objectId: -1,
          },
        }" color="accent" fab icon="add" padding="sm">
            </q-btn>
          </q-page-sticky>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
