<script lang="ts" setup>
import EventForm from '../../components/Events/EventsFormCtrl.vue';
import { useEventDetailsStore } from 'stores/event/eventDetailsStore';
import { ref, Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { eventDetails } from 'src/models/event/eventDetails';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useQuasar } from 'quasar';
import OCSaveButton from '../../components/OCcomponents/OC-SaveButton.vue';

const $q = useQuasar();

const eventDetailsStore = useEventDetailsStore();
const router = useRouter();
const route = useRoute();

const parentObjectId = route.params.objectId ? route.params.objectId : '';
const parentObjectServiceType = route.params.objectTypeId
  ? route.params.objectTypeId
  : '';

const isValid = ref(true);

//TODO: CR: 2024-05-17: nk: Fix the below type error?
const event: Ref<eventDetails> = ref({
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
  reminder: {},
  recurrence: {
    text: '',
    rule: '',
  },
  label: {},
  showTimeAs: {},
  meetingAttendees: [],
  url: '',
  security: {},
});

//TODO: CR: 2024-05-17: nk: Fix the below type error?
function handleRRule(rrule: string) {
  event.value.recurrence.rule = rrule;
}

//TODO: CR: 2024-05-17: nk: Fix the below type error?
function handleRRuleText(rruleText: string) {
  event.value.recurrence.text = rruleText;
}

//TODO: CR: 2024-05-17: nk: Fix the below type error?
function handleReminder(reminder: [string, number]) {
  event.value.reminder.to = reminder[0];
  event.value.reminder.beforeMinutes = reminder[1];
}

const childComponent = ref(null);

async function onSubmit(e: any) {
  //e.preventDefault();
  try {
    console.log(
      `onSubmit::childComponent validateAll: ${childComponent.value.validateAll()}`
    );
    if (!childComponent.value.validateAll()) return;
    const newEventDetails = ref(event);
    await eventDetailsStore.addEventDetails(newEventDetails.value);
    router.go(-1);
  } catch (error) {
    console.log(`*** New Event:onSubmit(...):catch: ${error} ***`);
    console.log(`---------${error}---------`);
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('*** New Event:onSubmit(...):onOK ***');
    });
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
          @click="$router.go(-1)"
        >
        </q-btn>
        <q-toolbar-title> New Event</q-toolbar-title>
        <!-- <q-btn
          class="q-px-md"
          dense
          label="Save"
          no-caps
          outline
          rounded
          type="submit"
          @click="onSubmit"
        /> -->
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <EventForm
            :event="event"
            ref="childComponent"
            @rrule-generated="handleRRule"
            @rrule-text-generated="handleRRuleText"
            @reminder-generated="handleReminder"
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
    </q-page-container>
  </q-layout>
</template>
