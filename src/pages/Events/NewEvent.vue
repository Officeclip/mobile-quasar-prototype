<script lang="ts" setup>
import EventForm from '../../components/Events/EventsFormCtrl.vue';
import { useEventDetailsStore } from 'stores/event/eventDetailsStore';
import { useEventSummaryStore } from '../../stores/event/eventSummaryStore';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useQuasar } from 'quasar';
import OCSaveButton from '../../components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();

const eventDetailsStore = useEventDetailsStore();
const eventSummaryStore = useEventSummaryStore();
const router = useRouter();
const route = useRoute();

const parentObjectId = route.params.objectId ? route.params.objectId : '';
const parentObjectServiceType = route.params.objectTypeId
  ? route.params.objectTypeId
  : '';
const appName = route.params.appName ? route.params.appName : '';

const event = ref({
  id: '',
  createdDate: new Date().toISOString(),
  createdGroupSid: '',
  createdUserSid: '',
  createdUserName: '',
  parent: {
    type: {
      id: parentObjectServiceType as string,
      name: '',
    },
    value: {
      id: parentObjectId as string,
      name: '',
    },
  },
  eventType: { id: '2', name: '' },
  eventName: '',
  eventDescription: '',
  startDateTime: new Date().toISOString(),
  endDateTime: dateTimeHelper.addHoursToDate(new Date(), 1).toISOString(),
  isAllDayEvent: false,
  eventUserSid: '',
  isRsvp: false,
  sendNotifications: false,
  eventLocation: '',
  modifiedDate: '',
  modifiedUserSid: '',
  modifiedUserName: '',
  reminder: {
    to: '',
    beforeMinutes: '',
  },
  recurrence: {
    text: '',
    rule: '',
  },
  label: {
    id: '',
    name: '',
    backColor: '',
    foreColor: '',
    borderColor: '',
  },
  showTimeAs: {
    id: '',
    name: '',
  },
  meetingAttendees: [],
  url: '',
  security: {
    read: false,
    write: false,
    append: false,
    delete: false,
  },
});

function handleRRule(rrule: string) {
  event.value.recurrence.rule = rrule;
}

function handleRRuleText(rruleText: string) {
  event.value.recurrence.text = rruleText;
}

function handleReminder(reminder: [string, number]) {
  event.value.reminder.to = reminder[0];
  event.value.reminder.beforeMinutes = reminder[1].toString();
}

const childComponent = ref<typeof EventForm>(); // see: https://stackoverflow.com/a/65027995

async function onSubmit() {
  $q.loading.show();
  try {
    if (!childComponent.value?.validateAll()) return;
    const newEventData = ref(event);
    await eventDetailsStore.addEventDetails(newEventData.value);
    await eventSummaryStore.resetEventSummaryList();
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  } finally {
    $q.loading.hide();
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          color="white"
          dense
          flat
          icon="arrow_back"
          round
          @click="router.go(-1)"
        >
        </q-btn>
        <q-toolbar-title> New Event</q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <EventForm
            :eventFromParent="event"
            :appNameFromParent="appName"
            ref="childComponent"
            @rrule-generated="handleRRule"
            @rrule-text-generated="handleRRuleText"
            @reminder-generated="handleReminder"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
