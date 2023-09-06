<script setup>
import EventForm from '../../components/Events/EventsFormCtrl.vue';
import { useEventsStore } from '../../stores/EventsStore';
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute()
const tab = ref('');
//const parentObjectId = ref()

const parentObjectId = route.params.id

const newparentObjectId = parentObjectId? parentObjectId: -1

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
    eventType: '2'

});

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
        eventType: event.value.eventType

    }
    console.log('new event form values: ', newEvent)
    eventsStore.addEvent(newEvent);

    router.push('/simpleCalendar')
}


</script>
<template>
    <q-layout view="lHh Lpr lFf">
        <q-header>
            <q-toolbar>
                <q-btn
                @click="$router.go(-1)"
                flat
                round
                dense
                color="white"
                icon="arrow_back">
                </q-btn>
                <q-toolbar-title> New Event</q-toolbar-title>
            </q-toolbar>
        </q-header>
        <q-page-container>
            <q-form @submit="onSubmit" class="q-gutter-md">
                <div>
                    <EventForm :event="event" />
                    <q-btn class="q-ml-md" label="Save" type="submit" color="primary"></q-btn>
                    <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm"></q-btn>
                </div>
            </q-form>
            <pre>{{ tab }}</pre>
        </q-page-container>

        <q-footer bordered class="bg-grey-3 text-primary">
        <q-tabs dense no-caps active-color="primary" class="text-grey-8" v-model="tab">
          <q-tab name="Group" label="Group"></q-tab>
          <q-tab name="Meeting" label="Meeting"></q-tab>
          <q-tab name="Private" label="Private"></q-tab>
        </q-tabs>
      </q-footer>

    </q-layout>
</template>

<style scoped></style>
