<!--
TODO: sg: Show the details of multi day event in the text(Event timing) [45]
-->

<script setup lang="ts">
import { useEventSummaryStore } from '../../stores/event/eventSummaryStore';
import { onMounted } from 'vue';
import { ref, computed } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper.js';
import { format } from 'date-fns';
import { eventSummary } from '../../models/event/eventSummary';

const eventSummaryStore = useEventSummaryStore();

const date = ref('');
date.value = format(new Date(), 'yyyy/MM/dd');

const eventSummary = computed(() => {
  return eventSummaryStore.EventSummary;
});

onMounted(() => {
  eventSummaryStore.getAllEventSummary();
});

const eventDates = computed(() => {
  return eventSummaryStore.getEventSummaryDates();
});

function getEventIcon(type: any) {
  if (type === 1) return 'group'; // group event
  if (type === 2) return 'groups'; // meetings
  return 'person'; // personal
}

const eventsForADay = computed(() => {
  const myEvents = eventSummaryStore.EventSummary; // FIXME: skd: Not implemented correctly... should be fixed! [45]
  if (myEvents.length === 0) {
    eventSummaryStore.getAllEventSummary();
  }
  let events = eventSummaryStore.getEventSummaryForADay(date.value);
  return events;
});

function getFromToDate(event: eventSummary) {
  const from = dateTimeHelper.extractTimeFromUtc(event.startDateTime);
  const to = dateTimeHelper.extractTimeFromUtc(event.endDateTime);
  console.log('TTTTTTTTTTT', from);
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
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated height-hint="48">
      <q-toolbar>
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title> OfficeClip Calendar </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <div class="q-ma-md">
          <div>
            <q-date landscape today-btn v-model="date" :events="eventDates" />
          </div>
          <div class="text-subtitle1 q-pt-md">Events for: {{ date }}</div>
          <q-list bordered>
            <pre>{{ eventsForADay }}</pre>
            <q-item
              v-for="event in eventsForADay"
              :key="event.id"
              :to="{
                name: 'eventDetails',
                params: { id: event.id },
              }"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon color="primary" :name="getEventIcon(event.eventType)" />
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
            <q-item class="flex items-center"
              >Legends: <q-icon color="primary" name="person" class="q-ml-md" />
              <div class="q-ml-sm text-caption">Personal</div>
              <q-icon color="primary" name="group" class="q-ml-md" />
              <div class="q-ml-sm text-caption">Meeting</div>
              <q-icon color="primary" name="groups" class="q-ml-md" />
              <div class="q-ml-sm text-caption">Group</div>
            </q-item>
          </q-list>
        </div>
        <div>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
              :to="{
                name: 'newEvent',
                params: {
                  id: -1,
                },
              }"
              fab
              icon="add"
              color="accent"
              padding="sm"
            >
            </q-btn>
          </q-page-sticky>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
