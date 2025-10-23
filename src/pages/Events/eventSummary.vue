<!--
TODO: sg: Show the details of multi day event in the text(Event timing) [45]
-->
<script lang="ts" setup>
import { eventSummary } from '../../models/event/eventSummary';
import { useEventSummaryStore } from '../../stores/event/eventSummaryStore';
import { computed, ref } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper.js';
import { format } from 'date-fns';
// import drawer from '../../components/drawer.vue';
import OC_Drawer from 'src/components/OC_Drawer.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

const eventSummaryStore = useEventSummaryStore();

const selectedDate = ref('');
selectedDate.value = format(new Date(), 'yyyy/MM/dd');

const yearAndMonth = ref(null);
const myDrawer = ref();

const calendarEventDates = computed(() => {
  return eventSummaryStore.getEventSummaryDates();
});

function getEventIcon(type: string) {
  if (type === '1') return 'groups'; // group event
  if (type === '2') return 'group'; // Personal
  return 'person'; // meetings
}

function getEventTypeColour(type: string) {
  if (type === '1') return 'red'; // group event
  if (type === '2') return 'secondary'; // personal
  return 'primary'; // meetings
}

const eventsForADay = computed(() => {
  const myEvents = eventSummaryStore.EventSummary; // FIXME: skd: Not implemented correctly... should be fixed! [45]
  if (myEvents.length === 0) {
    eventSummaryStore.getAllEventSummary(yearAndMonth.value);
  }
  let events = eventSummaryStore.getEventSummaryForADay(selectedDate.value);
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

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}
</script>
<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>

<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      title="OfficeClip Calendar"
      back-button-to="/homepage"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
    />
    <OC_Drawer ref="myDrawer" />
    <q-page-container>
      <q-page>
        <div class="q-ma-md">
          <q-list class="flex justify-center">
            <q-date
              v-model="selectedDate"
              :events="calendarEventDates"
              today-btn
              @navigation="getYearandMonth"
            />
          </q-list>
          <q-list class="q-pt-lg text-h6"
            >Events for:
            {{ dateTimeHelper.convertCalendarDateForUI(selectedDate) }}</q-list
          >
          <q-list bordered class="q-mt-sm">
            <q-item
              v-for="event in eventsForADay"
              :key="event.id"
              v-ripple
              :to="{
                name: 'eventDetails',
                params: { id: event.id, appName: 'event' },
              }"
              clickable
            >
              <q-item-section avatar>
                <q-icon
                  :name="getEventIcon(event.eventType.id)"
                  :color="getEventTypeColour(event.eventType.id)"
                />
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
              >Legends:
              <q-icon class="q-ml-md" color="primary" name="person" />
              <div class="q-ml-sm text-caption">Personal</div>
              <q-icon class="q-ml-md" color="secondary" name="group" />
              <div class="q-ml-sm text-caption">Meeting</div>
              <q-icon class="q-ml-md" color="red" name="groups" />
              <div class="q-ml-sm text-caption">Group</div>
            </q-item>
          </q-list>
          <q-page-sticky :offset="[18, 18]" position="bottom-right">
            <q-btn
              :to="{
                name: 'newEvent',
                params: {
                  id: -1,
                  objectTypeId: -1,
                  objectId: -1,
                  appName: 'event',
                },
              }"
              color="accent"
              fab
              icon="add"
              padding="md"
            >
            </q-btn>
          </q-page-sticky>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
