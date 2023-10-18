<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useEventDetailsStore } from '../../stores/event/eventDetailsStore';
import { useEventListsStore } from '../../stores/event/eventListsStore';
import { useReminderDataStore } from 'stores/reminder/reminderData';
import { useRoute, useRouter } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import QDetailsItem from '../../components/Events/QDetailsItem.vue';

const route = useRoute();
const router = useRouter();
const eventDetailsStore = useEventDetailsStore();
const reminderDataStore = useReminderDataStore();

const paramsId = route.params.id;
eventDetailsStore.getEventDetailsById(paramsId);
reminderDataStore.getReminderObject();
const event = computed(() => {
  console.log('details page:', eventDetailsStore.EventDetails);
  return eventDetailsStore.EventDetails;
});

// Find the selected reminder option and time based on refs
const selectedOption = computed(() => {
  const reminderOptions = reminderDataStore.ReminderOptions;
  const obj = reminderOptions.find(
    (option: any) => option.value === event.value?.remindTo
  );
  return obj ? obj : 'null';
});
const selectedTime = computed(() => {
  const reminderTimes = reminderDataStore.ReminderTimes;
  const obj = reminderTimes.find(
    (time: any) => time.value === event.value?.remindBeforeMinutes
  );
  return obj ? obj : 'null';
});

const id = ref<string | string[]>('0');

const showConfirmationDialog = ref(false);

function displayConfirmationDialog() {
  showConfirmationDialog.value = true;
}

function confirmDeleteEvent() {
  console.log('deleted event id is :', event.value?.id);
  eventDetailsStore.deleteEventDetails(event.value?.id).then(() => {
    showConfirmationDialog.value = false;
    router.go(-1);
  });
}
function showMeetingType(eventType: string | undefined) {
  switch (eventType) {
    case '1':
      return 'Group';
    case '2':
      return 'Meeting';
    case '3':
      return 'Private';
    default:
      return '';
  }
}
const startDate = computed(() => {
  if (event.value?.startDateTime) {
    const data = dateTimeHelper.extractDateandTimeFromUtc(
      event.value?.startDateTime,
      event.value?.isAllDayEvent
    );
    return data;
  }
  return 'YYYY';
});
const endDate = computed(() => {
  if (event.value?.endDateTime) {
    const data = dateTimeHelper.extractDateandTimeFromUtc(
      event.value?.endDateTime,
      event.value?.isAllDayEvent
    );
    return data;
  }
  return 'YYYY';
});
const createdDate = computed(() => {
  if (event.value?.createdDate) {
    const data = dateTimeHelper.extractDateandTimeFromUtc(
      event.value?.createdDate,
      event.value?.isAllDayEvent
    );
    return data;
  }
  return 'YYYY';
});
const attendeesList = computed(() => {
  if (event.value?.meetingAttendees) {
    const data = event.value?.meetingAttendees;
    return data;
  }
  return 'No attendees added yet';
});

//filter and get the single label object by labelId
const eventListStore = useEventListsStore();
eventListStore.getEventLists();
const labelNameById = computed(() => {
  const labelData = eventListStore.Labels;
  const obj = labelData.find((obj: any) => obj.id === event.value?.label);
  return obj ? obj : null;
});
console.log('Testing the label object by labelid::', labelNameById);
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-primary text-white" height-hint="98" reveal>
      <q-toolbar>
        <q-btn
          color="white"
          dense
          flat
          icon="arrow_back"
          round
          @click="$router.go(-1)"
        />
        <q-toolbar-title> Event details</q-toolbar-title>

        <q-btn
          :to="{ name: 'editEvent', params: { id: paramsId } }"
          color="white"
          dense
          flat
          icon="edit"
          round
        />
        <q-btn
          color="white"
          dense
          flat
          icon="delete"
          round
          @click="displayConfirmationDialog"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-list>
        <QDetailsItem :label2="`${showMeetingType(event?.eventType)} event`" />
        <!-- <q-item>
          <q-item-section>
            <q-item-label
              >{{ showMeetingType(event?.eventType) }} event</q-item-label
            >
          </q-item-section>
        </q-item> -->
        <QDetailsItem
          :caption="true"
          label1="Created On"
          :label2="createdDate"
        />
        <!-- <q-item>
          <q-item-section>
            <q-item-label caption>Created On</q-item-label>
            <q-item-label>{{ createdDate }}</q-item-label>
          </q-item-section>
        </q-item> -->
        <QDetailsItem
          :caption="true"
          label1="Event Name"
          :label2="event?.eventName"
        />
        <!-- <q-item>
          <q-item-section>
            <q-item-label caption>Event Name</q-item-label>
            <q-item-label>{{ event?.eventName }}</q-item-label>
          </q-item-section>
        </q-item> -->
        <QDetailsItem
          v-if="event?.eventDescription"
          :caption="true"
          label1="Description"
          :label2="event?.eventDescription"
        />
        <!-- <q-item v-if="event?.eventDescription">
          <q-item-section>
            <q-item-label caption>Description</q-item-label>
            <q-item-label>{{ event?.eventDescription }}</q-item-label>
          </q-item-section>
        </q-item> -->
        <QDetailsItem
          v-if="event?.eventLocation"
          :caption="true"
          label1="Event Location"
          :label2="event?.eventLocation"
        />
        <!-- <q-item v-if="event?.eventLocation">
          <q-item-section>
            <q-item-label caption>Event Location</q-item-label>
            <q-item-label>{{ event?.eventLocation }}</q-item-label>
          </q-item-section>
        </q-item> -->
        <QDetailsItem :caption="true" label1="Start Date" :label2="startDate" />
        <!-- <q-item>
          <q-item-section>
            <q-item-label caption>Start Date</q-item-label>
            <q-item-label>{{ startDate }} </q-item-label>
          </q-item-section>
        </q-item> -->
        <QDetailsItem :caption="true" label1="End Date" :label2="endDate" />
        <!-- <q-item>
          <q-item-section>
            <q-item-label caption>End Date</q-item-label>
            <q-item-label>{{ endDate }} </q-item-label>
          </q-item-section>
        </q-item> -->
        <QDetailsItem
          :caption="true"
          label1="Is All Day Event ?"
          :label2="event?.isAllDayEvent ? 'Yes' : 'No'"
        />
        <!-- <q-item>
          <q-item-section>
            <q-item-label caption>Is All Day Event ?</q-item-label>
            <q-item-label>{{
              event?.isAllDayEvent ? 'Yes' : 'No'
            }}</q-item-label>
          </q-item-section>
        </q-item> -->
        <q-item v-if="event?.meetingAttendees">
          <q-item-section>
            <q-item-label caption> Attendees </q-item-label>
            <div style="display: inline-flex; align-items: baseline">
              <q-item-label
                v-for="attendee in attendeesList"
                :key="attendee.name"
              >
                <q-chip dense class="q-px-sm">{{ attendee.name }}</q-chip>
              </q-item-label>
            </div>
          </q-item-section>
        </q-item>
        <q-item v-if="event?.label">
          <q-item-section>
            <q-item-label caption> Label </q-item-label>
            <q-item-label>
              <span
                class="q-py-xs q-px-sm"
                :style="{ backgroundColor: labelNameById?.color }"
                >{{ labelNameById?.name }}</span
              >
            </q-item-label>
          </q-item-section>
        </q-item>
        <QDetailsItem
          v-if="event?.repeatInfoText"
          :caption="true"
          label1="Repeat"
          :label2="event?.repeatInfoText"
        />
        <!-- <q-item v-if="event?.repeatInfoText">
          <q-item-section>
            <q-item-label caption> Repeat </q-item-label>
            <q-item-label> {{ event?.repeatInfoText }} </q-item-label>
          </q-item-section>
        </q-item> -->
        <QDetailsItem
          v-if="event?.remindTo"
          :caption="true"
          label1="Recurrence"
          :label2="`${selectedOption?.label} ${selectedTime?.label}`"
        />
        <!-- <q-item v-if="event?.remindTo">
          <q-item-section>
            <q-item-label caption> Recurrence </q-item-label>
            <q-item-label>
              {{ selectedOption?.label }} {{ selectedTime?.label }} before
            </q-item-label>
          </q-item-section>
        </q-item> -->
      </q-list>
    </q-page-container>
  </q-layout>

  <q-dialog v-model="showConfirmationDialog">
    <q-card>
      <q-card-section>
        <q-item-label>Confirm</q-item-label>
        <q-item-label>Are you sure you want to delete this event?</q-item-label>
        <q-card-actions align="right">
          <q-btn
            color="primary"
            label="Cancel"
            @click="showConfirmationDialog = false"
          />
          <q-btn color="negative" label="Delete" @click="confirmDeleteEvent" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
