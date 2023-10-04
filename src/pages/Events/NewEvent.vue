<script lang="ts" setup>
import EventForm from '../../components/Events/EventsFormCtrl.vue';
import { useEventDetailsStore } from 'stores/event/eventDetailsStore';
import { ref, Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { eventDetails } from 'src/models/event/eventDetails';
import dateTimeHelper from 'src/helpers/dateTimeHelper';
import { eventSummary } from 'src/models/event/eventSummary';

const eventDetailsStore = useEventDetailsStore();

const router = useRouter();
const route = useRoute();
//const parentObjectId = ref()

const parentObjectId = route.params.id;

const newparentObjectId = parentObjectId ? parentObjectId : -'1';
const event: Ref<eventDetails> = ref({
  eventName: '',
  eventDescription: '',
  eventLocation: '',
  startDateTime: '',
  endDateTime: '',
  isAllDayEvent: false,
  meetingAttendees: [],
  timezoneId: '2',
  label: '1',
  url: '',
  parentServiceType: -1,
  parentSid: newparentObjectId,
  eventType: '2',
  recurrenceRule: '',
  repeatInfoText: '',
  remindTo: 'Me',
  remindBeforeMinutes: 3600,
  id: '',
  createdDate: new Date().toISOString(),
  createdGroupSId: '',
  createdUserSid: '',
  eventUserSid: '',
  isRsvp: false,
  sendNotifications: false,
  modifiedDate: '',
  modifiedUserSid: '',
});

function handleRRule(rrule: string) {
  event.value.recurrenceRule = rrule;
}

function handleRRuleText(rruleText: string) {
  event.value.repeatInfoText = rruleText;
}

function handleReminder(reminder: [string, number]) {
  event.value.remindTo = reminder[0];
  event.value.remindBeforeMinutes = reminder[1];
}

function onSubmit(e: any) {
  e.preventDefault();
  const formData = new FormData(e.target);
  // const data = [];
  // for (const [name, value] of formData.entries()){
  //   data.push({
  //     name,
  //     value
  //   })
  // };

  // const start = formData.get('startDateTime');
  // const end = formData.get('endDateTime');
  // console.log(`EditEvent: startDateTime: ${start}, ${end}`);

  const startDateTime = event.value?.startDateTime;
  const newStartDateTime = dateTimeHelper.convertLocalDateToUTC(startDateTime);

  const endDateTime = event.value?.endDateTime;
  const newEndDateTime = dateTimeHelper.convertLocalDateToUTC(endDateTime);

  if (!event.value.eventName) {
    alert('Please add text');
    return;
  }

  const newEventDetails: eventDetails = {
    eventName: event.value.eventName,
    eventDescription: event.value.eventDescription,
    eventLocation: event.value.eventLocation,
    startDateTime: newStartDateTime,
    endDateTime: newEndDateTime,
    isAllDayEvent: event.value.isAllDayEvent,
    meetingAttendees: event.value.meetingAttendees,
    timezoneId: event.value.timezoneId,
    label: event.value.label,
    url: event.value.url,
    parentServiceType: event.value.parentServiceType,
    parentSid: event.value.parentSid,
    eventType: event.value.eventType,
    recurrenceRule: event.value.recurrenceRule,
    repeatInfoText: event.value.repeatInfoText,
    remindTo: event.value.remindTo,
    remindBeforeMinutes: event.value.remindBeforeMinutes,
    id: event.value.id,
    createdDate: event.value.createdDate,
    createdGroupSId: event.value.createdGroupSId,
    createdUserSid: event.value.createdUserSid,
    eventUserSid: event.value.eventUserSid,
    isRsvp: event.value.isRsvp,
    sendNotifications: event.value.sendNotifications,
    modifiedDate: event.value.modifiedDate,
    modifiedUserSid: event.value.modifiedUserSid,
  };

  const newEventSummary: eventSummary = {
    eventType: newEventDetails.eventType,
    eventName: newEventDetails.eventName,
    startDateTime: newEventDetails.startDateTime,
    endDateTime: newEventDetails.endDateTime,
    isAllDayEvent: newEventDetails.isAllDayEvent,
    id: '',
  };
  console.log('new event form values: ', newEventDetails);
  eventDetailsStore.addEventDetails(newEventDetails);
  eventDetailsStore.addEventSummary(newEventSummary);

  router.push('/eventSummary');
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-cyan">
      <q-toolbar>
        <q-btn
          color="white"
          dense
          flat
          icon="arrow_back"
          round
          @click="$router.go(-1)"
        >
        </q-btn>
        <q-toolbar-title> New Event</q-toolbar-title>
        <q-btn
          class="q-px-md"
          dense
          label="Save"
          no-caps
          outline
          rounded
          type="submit"
          @click="onSubmit"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <EventForm
            :event="event"
            @rrule-generated="handleRRule"
            @rrule-text-generated="handleRRuleText"
            @reminder-generated="handleReminder"
          />
          <q-btn
            class="q-ml-md"
            color="primary"
            label="Save"
            no-caps
            type="submit"
          />
          <q-btn
            class="q-ml-sm"
            color="primary"
            flat
            label="Reset"
            no-caps
            type="reset"
          />
        </div>
      </q-form>
      <!-- <pre>{{ tab }}</pre> -->
    </q-page-container>

    <!-- <q-footer bordered class="bg-grey-3 text-primary">
      <q-tabs
        v-model="tab"
        active-color="primary"
        class="text-grey-8"
        dense
        no-caps
      >
        <q-tab label="Group" name="Group"></q-tab>
        <q-tab label="Meeting" name="Meeting"></q-tab>
        <q-tab label="Private" name="Private"></q-tab>
      </q-tabs>
    </q-footer> -->
  </q-layout>
</template>

<style scoped></style>
