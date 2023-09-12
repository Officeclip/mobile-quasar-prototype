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
  parentObjectServiceType: '14',
  parentObjectId: newparentObjectId,
  eventType: '2',
  recurrenceString:''
});

function handleRRule(rrule){
  event.value.recurrenceString = rrule;
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
    parentObjectServiceType: event.value.parentObjectServiceType,
    parentObjectId: event.value.parentObjectId,
    eventType: event.value.eventType,
    recurrence: event.value.recurrenceString
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
                outline
                rounded
                dense
                label="Save"
                no-caps
                type="submit"
                @submit="onSubmit"
                class="q-px-md"></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-form class="q-gutter-md" @submit="onSubmit">
        <div>
          <EventForm :event="event" @rrule-generated="handleRRule"/>
          <q-btn class="q-ml-md" color="primary" label="Save" type="submit"></q-btn>
          <q-btn class="q-ml-sm" color="primary" flat label="Reset" type="reset"></q-btn>
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
