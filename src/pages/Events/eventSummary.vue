<script lang="ts" setup>
import { eventSummary } from '../../models/event/eventSummary';
import { useEventSummaryStore } from '../../stores/event/eventSummaryStore';
import { computed, ref, onMounted } from 'vue';
import { format, isSameDay } from 'date-fns';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

const eventSummaryStore = useEventSummaryStore();

const selectedDate = ref('');
selectedDate.value = format(new Date(), 'yyyy/MM/dd');

const yearAndMonth = ref(null);
onMounted(() => {
  const now = new Date();
  const currentDisplay = { year: now.getFullYear(), month: now.getMonth() + 1 };
  yearAndMonth.value = currentDisplay;
  eventSummaryStore.getAllEventSummary(currentDisplay);
});

const displayedMonthYear = computed(() => {
  const dateToShow = yearAndMonth.value
    ? new Date(yearAndMonth.value.year, yearAndMonth.value.month - 1)
    : new Date(selectedDate.value);
  return format(dateToShow, 'MMMM yyyy');
});

const calendarEventDates = computed(() => {
  return eventSummaryStore.getEventSummaryDates();
});

function getEventTypeColour(type: string) {
  if (type === '1') return 'red'; // Group Event
  if (type === '2') return 'secondary'; // Personal
  return 'primary'; // Meeting
}

const eventsForADay = computed(() => {
  return eventSummaryStore.getEventSummaryForADay(selectedDate.value);
});

function getEventType(event: eventSummary) {
  const fromDateTime = new Date(event.startDateTime as string);
  const toDateTime = new Date(event.endDateTime as string);

  if (event.isAllDayEvent) {
    if (isSameDay(fromDateTime, toDateTime)) {
      return 'All Day';
    } else {
      // Handle multi-day all-day events
      return `All Day: ${format(fromDateTime, 'MMM d')} - ${format(
        toDateTime,
        'MMM d',
      )}`;
    }
  }

  const fromTime = format(fromDateTime, 'p');
  const toTime = format(toDateTime, 'p');

  if (isSameDay(fromDateTime, toDateTime)) {
    return `${fromTime} - ${toTime}`;
  } else {
    // Handle multi-day events with specific times
    return `${format(fromDateTime, 'MMM d, p')} to ${format(
      toDateTime,
      'MMM d, p',
    )}`;
  }
}

const getYearandMonth = (newvalue: any) => {
  yearAndMonth.value = newvalue;
  eventSummaryStore.getAllEventSummary(yearAndMonth.value);
};

const eventListTitle = computed(() => {
  const today = new Date();
  const d = new Date(selectedDate.value);

  if (isSameDay(today, d)) {
    return "Today's Events";
  }
  return `${format(d, 'MMM d, yyyy')} Events`;
});
</script>
<style lang="scss">
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>
<style lang="scss" scoped>
.event-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.3s;
  cursor: pointer;
  .q-card__section {
    padding-left: 22px;
  }
}
.event-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.event-color-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
}
</style>

<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header title="Calendar" back-button-to="/homepage" />
    <q-page-container>
      <q-page class="q-pa-md">
        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-5">
            <q-card flat>
              <q-card-section>
                <div class="text-h6 text-center text-primary q-mb-md">
                  {{ displayedMonthYear }}
                </div>
                <!--
                  NOTE: q-date does not support showing multiple dots for multiple events on a day.
                  To implement this, a more advanced calendar component like QCalendar
                  or a custom implementation would be needed.
                -->
                <q-date
                  v-model="selectedDate"
                  :events="calendarEventDates"
                  event-color="primary"
                  minimal
                  class="full-width"
                  today-btn
                  @navigation="getYearandMonth"
                />
              </q-card-section>
              <q-card-section class="q-pt-none">
                <div
                  class="row items-center q-gutter-x-lg justify-center text-caption text-grey-8"
                >
                  <div class="flex items-center">
                    <q-badge rounded color="primary" class="q-mr-sm" />
                    <span>Meeting</span>
                  </div>
                  <div class="flex items-center">
                    <q-badge rounded color="secondary" class="q-mr-sm" />
                    <span>Personal</span>
                  </div>
                  <div class="flex items-center">
                    <q-badge rounded color="red" class="q-mr-sm" />
                    <span>Group Event</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-7">
            <div class="text-h6 q-mb-sm">
              {{ eventListTitle }}
            </div>
            <!-- <q-separator class="q-my-md" /> -->

            <div v-if="eventsForADay.length > 0">
              <q-card
                v-for="event in eventsForADay"
                :key="event.id"
                class="q-mb-md event-card"
                flat
                bordered
                @click="
                  $router.push({
                    name: 'eventDetails',
                    params: { id: event.id, appName: 'event' },
                  })
                "
              >
                <div
                  class="event-color-bar"
                  :class="`bg-${getEventTypeColour(event.eventType.id)}`"
                ></div>
                <q-card-section>
                  <div class="row items-center no-wrap">
                    <div class="col">
                      <div class="text-subtitle1 text-weight-bold ellipsis">
                        {{ event.eventName }}
                      </div>
                      <div class="text-caption text-grey-7 ellipsis">
                        <q-icon name="schedule" size="xs" class="q-mr-xs" />
                        {{ getEventType(event) }}
                      </div>
                    </div>
                    <div class="col-auto">
                      <q-icon name="chevron_right" color="grey-6" size="sm" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div v-else class="text-center text-grey-6 q-py-xl">
              <q-icon name="event_busy" size="4em" />
              <div class="text-subtitle1 q-mt-md">
                No events scheduled for this day.
              </div>
            </div>
          </div>
        </div>

        <div>
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
