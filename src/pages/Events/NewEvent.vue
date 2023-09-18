<script setup>
import EventForm from '../../components/Events/EventsFormCtrl.vue';
import {useEventsStore} from 'stores/EventsStore';
import {ref} from 'vue'
import {useRoute, useRouter} from 'vue-router';

const router = useRouter();
const route = useRoute()
const tab = ref('Group');
//const parentObjectId = ref()

const parentObjectId = route.params.id

const newparentObjectId = parentObjectId ? parentObjectId : -1

const eventsStore = useEventsStore()
const event = ref({
  eventName: '',
  eventDescription: '',
  eventLocation: '',
  startDateTime: '',
  endDateTime: '',
  isAllDayEvent: false,
  meetingAttendees: [],
  timezone: '',
  label: '',
  url: '',
  parentObjectServiceType: '14',
  parentObjectId: newparentObjectId,
  eventType: '2',
  recurrenceRule: '',
  repeatInfoText: '',
  remindTo: 'Me',
  remindBeforeMinutes: 3600

});

function handleRRule(rrule) {
  event.value.recurrenceString = rrule;
}

function handleRRuleText(rruleText) {
  event.value.repeatInfoText = rruleText;
}

function handleReminder(reminder) {
  event.value.remindTo = reminder[0];
  event.value.remindBeforeMinutes = reminder[1];
}

function onSubmit(e) {
  e.preventDefault()
  const formData = new FormData(e.target);
  // const data = [];
  // for (const [name, value] of formData.entries()){
  //   data.push({
  //     name,
  //     value
  //   })
  // };
  const start = formData.get('startDateTime');
  const end = formData.get('endDateTime');
  console.log(`EditEvent: startDateTime: ${start}, ${end}`);

  if (!event.value.eventName) {
    alert('Please add text')
    return
  }

  const newEvent = {
    eventName: event.value.eventName,
    eventDescription: event.value.eventDescription,
    eventLocation: event.value.eventLocation,
    startDateTime: start,
    endDateTime: end,
    isAllDayEvent: event.value.isAllDayEvent,
    meetingAttendees: event.value.meetingAttendees,
    timezone: event.value.timezone,
    label: event.value.label,
    url: event.value.url,
    parentObjectServiceType: event.value.parentObjectServiceType,
    parentObjectId: event.value.parentObjectId,
    eventType: event.value.eventType,
    recurrenceRule: event.value.recurrenceString,
    repeatInfoText: event.value.repeatInfoText,
    remindTo: event.value.remindTo,
    remindBeforeMinutes: event.value.remindBeforeMinutes
  }
  console.log('new event form values: ', newEvent)
  eventsStore.addEvent(newEvent);
  router.push('/simpleCalendar')
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
          @click="$router.go(-1)">
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
          @click="onSubmit"></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <EventForm :event="event" @rrule-generated="handleRRule" @rrule-text-generated="handleRRuleText"
                     @reminder-generated="handleReminder"/>
          <q-btn class="q-ml-md" color="primary" label="Save" no-caps type="submit"></q-btn>
          <q-btn class="q-ml-sm" color="primary" flat label="Reset" no-caps type="reset"></q-btn>
        </div>
      </q-form>
      <pre>{{ tab }}</pre>
    </q-page-container>

    <q-footer bordered class="bg-grey-3 text-primary">
      <q-tabs v-model="tab" active-color="primary" class="text-grey-8" dense no-caps>
        <q-tab label="Group" name="Group"></q-tab>
        <q-tab label="Meeting" name="Meeting"></q-tab>
        <q-tab label="Private" name="Private"></q-tab>
      </q-tabs>
    </q-footer>

  </q-layout>
</template>

<style scoped></style>
