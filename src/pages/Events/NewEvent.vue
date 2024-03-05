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

const parentObjectId = route.params.objectId ? route.params.objectId : -1;

const parentObjectServiceType = route.params.objectTypeId
  ? route.params.objectTypeId
  : -1;

const event: Ref<eventDetails> = ref({
  id: '',
  createdDate: new Date().toISOString(),
  createdGroupSid: '',
  createdUserSid: '',
  createdUserName: '',
  parent: {
    type: {
      id: '',
      name: '',
    },
    value: {
      id: '',
      name: '',
    },
  },
  // parentServiceType: Number(parentObjectServiceType),
  //parentSid: Number(parentObjectId),
  eventType: '2',
  eventName: '',
  eventDescription: '',
  startDateTime: new Date().toISOString(),
  endDateTime: new Date().toISOString(),
  isAllDayEvent: false,
  eventUserSid: '',
  isRsvp: false,
  sendNotifications: false,
  eventLocation: '',
  modifiedDate: '',
  modifiedUserSid: '',
  modifiedUserName: '',
  timezoneId: '2',
  reminder: {
    to: '',
    beforeMinutes: '',
  },
  // remindTo: '',
  // remindBeforeMinutes: Number,
  recurrence: {
    text: '',
    rule: '',
  },
  // repeatInfoText: '',
  // recurrenceRule: '',
  label: '1',
  ShowTimeAs: [],
  meetingAttendees: [],
  url: '',
  security: [],
});

// function handleRRule(rrule: string) {
//   event.value.recurrenceRule = rrule;
// }
function handleRRule(rrule: string) {
  event.value.recurrence.rule = rrule;
}

// function handleRRuleText(rruleText: string) {
//   event.value.repeatInfoText = rruleText;
// }
function handleRRuleText(rruleText: string) {
  event.value.recurrence.text = rruleText;
}

// function handleReminder(reminder: [string, number]) {
//   event.value.remindTo = reminder[0];
//   event.value.remindBeforeMinutes = reminder[1];
// }

function handleReminder(reminder: [string, number]) {
  event.value.reminder.to = reminder[0];
  event.value.reminder.beforeMinutes = reminder[1];
}

function onSubmit(e: any) {
  e.preventDefault();
  // const formData = new FormData(e.target);
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

  // not sure already it has converted in the form cntrl
  // const startDateTime = event.value?.startDateTime;
  // const newStartDateTime = dateTimeHelper.convertLocalDateToUTC(startDateTime);

  // const endDateTime = event.value?.endDateTime;
  // const newEndDateTime = dateTimeHelper.convertLocalDateToUTC(endDateTime);

  // if (!event.value.eventName) {
  //   alert('Please add text');
  //   return;
  // }

  // const newEventDetails: eventDetails = {
  //   id: event.value.id,
  //   parentServiceType: event.value.parentServiceType,
  //   eventType: event.value.eventType,
  //   eventName: event.value.eventName,
  //   eventDescription: event.value.eventDescription,
  //   startDateTime: event.value?.startDateTime,
  //   endDateTime: event.value?.endDateTime,
  //   isAllDayEvent: event.value.isAllDayEvent,
  //   eventLocation: event.value.eventLocation,
  //   createdDate: event.value.createdDate,
  //   createdGroupSId: event.value.createdGroupSId,
  //   createdUserSid: event.value.createdUserSid,
  //   parentSid: event.value.parentSid,
  //   eventUserSid: event.value.eventUserSid,
  //   isRsvp: event.value.isRsvp,
  //   sendNotifications: event.value.sendNotifications,
  //   repeatInfoText: event.value.repeatInfoText,
  //   recurrenceRule: event.value.recurrenceRule,
  //   modifiedDate: event.value.modifiedDate,
  //   modifiedUserSid: event.value.modifiedUserSid,
  //   timezoneId: event.value.timezoneId,
  //   remindTo: event.value.remindTo,
  //   remindBeforeMinutes: event.value.remindBeforeMinutes,
  //   label: event.value.label,
  //   meetingAttendees: event.value.meetingAttendees,
  //   url: event.value.url,
  // };

  const newEventDetails = ref(event);
  // const newEventSummary: eventSummary = {
  //   eventType: newEventDetails.value.eventType,
  //   eventName: newEventDetails.value.eventName,
  //   startDateTime: newEventDetails.value.startDateTime,
  //   endDateTime: newEventDetails.value.endDateTime,
  //   isAllDayEvent: newEventDetails.value.isAllDayEvent,
  //   id: Number(),
  // };
  console.log('new event form values: ', newEventDetails);
  eventDetailsStore.addEventDetails(newEventDetails.value);
  // eventDetailsStore.addEventSummary(newEventSummary);
  router.go(-1);
  //router.push('/eventSummary');
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
          <!-- <q-btn
            class="q-ml-md"
            color="primary"
            label="Save"
            no-caps
            type="submit"
          /> -->
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
