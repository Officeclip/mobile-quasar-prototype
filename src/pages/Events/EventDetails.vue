<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useEventDetailsStore } from '../../stores/event/eventDetailsStore';
import { useEventListsStore } from '../../stores/event/eventListsStore';
import { useReminderDataStore } from 'stores/reminder/reminderData';
import { useRoute, useRouter } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import OCItem from '../../components/OCcomponents/OC-Item.vue';
import ConfirmationDialog from '../../components/general/ConfirmDelete.vue';

const route = useRoute();
const router = useRouter();
const eventDetailsStore = useEventDetailsStore();
const reminderDataStore = useReminderDataStore();

const id = route.params.id;

eventDetailsStore.getEventDetailsById(id);
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
const lastModifiedDate = computed(() => {
  if (event.value?.modifiedDate) {
    const data = dateTimeHelper.extractDateandTimeFromUtc(
      event.value?.modifiedDate,
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

const showTimeAsById = computed(() => {
  const data = eventListStore.ShowMyTimeAs;
  const obj = data.find((obj: any) => obj.id === event.value?.ShowTimeAs);
  return obj ? obj : null;
});

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this event?');
const showConfirmationDialog = ref(false);
const displayConfirmationDialog = () => {
  showConfirmationDialog.value = true;
};
const cancelConfirmation = () => {
  showConfirmationDialog.value = false;
};
const confirmDeletion = () => {
  eventDetailsStore.deleteEventDetails(event.value?.id).then(() => {
    showConfirmationDialog.value = false;
    router.go(-1);
  });
};
const openUrl = () => {
  const url = event.value?.url;
  window.open('http://' + url, '_blank');
};
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
        <q-toolbar-title
          ><OCItem :value="`${showMeetingType(event?.eventType)} event`"
        /></q-toolbar-title>

        <q-btn
          :to="{ name: 'editEvent', params: { id: id } }"
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
        <!-- <OCItem :value="`${showMeetingType(event?.eventType)} event`" /> -->
        <OCItem :value="event?.eventName" class="text-h6" />
        <OCItem
          v-if="event?.eventDescription"
          :value="event?.eventDescription"
        />

        <OCItem
          v-if="event?.eventLocation"
          title="Location"
          :value="event?.eventLocation"
        />
        <OCItem title="Start Date" :value="startDate" />
        <OCItem title="End Date" :value="endDate" />
        <OCItem
          title="Is All Day Event ?"
          :value="event?.isAllDayEvent ? 'Yes' : 'No'"
        />
        <q-item v-if="event?.meetingAttendees">
          <q-item-section>
            <q-item-label caption> Attendees </q-item-label>
            <div style="display: inline-flex; align-items: baseline">
              <q-item-label
                v-for="attendee in attendeesList"
                :key="attendee.name"
              >
                <q-chip dense class="q-px-sm">{{ attendee.name }}</q-chip>
                <q-tooltip>{{ attendee.email }}</q-tooltip>
              </q-item-label>
            </div>
          </q-item-section>
        </q-item>
        <q-item v-if="event?.url">
          <q-item-section>
            <q-item-label caption>Url </q-item-label>
            <q-item-label class="cursor-pointer" @click="openUrl"
              >{{ event.url }}
            </q-item-label>
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
        <q-item v-if="event?.ShowTimeAs">
          <q-item-section>
            <q-item-label caption> Show Time As </q-item-label>
            <q-item-label>
              <span
                class="q-py-xs q-px-sm"
                :style="{ backgroundColor: showTimeAsById?.color }"
                >{{ showTimeAsById?.name }}</span
              >
            </q-item-label>
          </q-item-section>
        </q-item>
        <OCItem
          v-if="event?.repeatInfoText"
          title="Repeat"
          :value="event?.repeatInfoText"
        />
        <OCItem
          v-if="event?.remindTo"
          title="Reminder"
          :value="`${selectedOption?.label} ${selectedTime?.label} Before`"
        />
        <q-item>
          <q-item-section>
            <q-item-label caption> Created </q-item-label>
            <q-item-label>
              {{ event?.createdUserName }} <span class="text-italic">On</span>
              {{ createdDate }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption> Last Modified </q-item-label>
            <q-item-label>
              {{ event?.modifiedUserName }} <span class="text-italic">On</span>
              {{ lastModifiedDate }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <!-- <OCItem title="Created" :value="createdDate" /> -->
        <!-- <OCItem title="Last Modified" :value="lastModifiedDate" /> -->
      </q-list>
    </q-page-container>
  </q-layout>

  <ConfirmationDialog
    v-if="showConfirmationDialog"
    :showConfirmationDialog="showConfirmationDialog"
    :title="title"
    :message="message"
    @cancel="cancelConfirmation"
    @confirm="confirmDeletion"
  />
</template>
