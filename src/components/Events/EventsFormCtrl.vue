<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import{ useEventsStore } from '../../stores/EventsStore'

const props = defineProps(['event']);

const startDateTime = ref('');
const endDateTime = ref('');
const timezone = ref('');
const location = ref('');
const regardings = ref('');
const names = ref('')
const dialog = ref(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const meeetingAttendees: any = ref([])

const eventsStore = useEventsStore();
onMounted(() => {
  eventsStore.getAllMeetingAttendees()
  console.log('YYYYYYYYYYYY', eventsStore.MeetingAttendees)
});

const dialogoptions = eventsStore.MeetingAttendees
// const cancelEnabled = ref(false)

startDateTime.value = props.event.startDateTime;
endDateTime.value = props.event.endDateTime;

const formattedStartDateTime = computed(() => {
  console.log('TestDuttaForm: allDay value:', props.event.isAllDayEvent);
  let dateValue = dateTimeHelper.extractDateFromUtc(startDateTime.value);
  let timeValue = dateTimeHelper.extractTimeFromUtc(startDateTime.value);
  if (props.event.isAllDayEvent) {
    return dateValue;
  } else {
    return `${dateValue} ${timeValue}`;
  }
});

const formattedStartDateTime2 =
  startDateTime.value
    ? formattedStartDateTime
    : startDateTime

const formattedEndDateTime = computed(() => {
  console.log('TestDuttaForm: allDay value:', props.event.isAllDayEvent);
  let dateValue = dateTimeHelper.extractDateFromUtc(endDateTime.value);
  let timeValue = dateTimeHelper.extractTimeFromUtc(endDateTime.value);
  if (props.event.isAllDayEvent) {
    return dateValue;
  } else {
    return `${dateValue} ${timeValue}`;
  }
});

const formattedEndDateTime2 =
  endDateTime.value
    ? formattedEndDateTime
    : endDateTime

const maskDateTime = computed(() => {
  if (props.event.isAllDayEvent) {
    return 'YYYY-MM-DD';
  } else {
    return 'YYYY-MM-DD HH:mm';
  }
});

const timeZoneOptions = [
  {
    timezoneId: 1,
    label: 'sample data 1'
    },
    {
    timezoneId: 2,
    label: 'sample data 2'
    },
    {
    timezoneId: 3,
    label: 'sample data 3'
    }
          ]
</script>

<template>
  <!-- FIXME: remove the warning -->
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input
        name="eventName"
        v-model="event.eventName"
        label="Event Name"
        placeholder="enter event name"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']">
        </q-input>

        <q-toggle
        name="isAllDayEvent"
        :false-value= 'false'
        label="All Day Event"
        :true-value= 'true'
        color="primary"
        keep-color
        v-model="event.isAllDayEvent"></q-toggle>

        <q-input
        name="startDateTime"
        v-model="formattedStartDateTime2"
        label="Start Date">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="startDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.event.isAllDayEvent" v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-if="!props.event.isAllDayEvent" v-model="startDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
        name="endDateTime"
        v-model="formattedEndDateTime2"
        label="End Date">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="endDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.event.isAllDayEvent" v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="endDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-select name="newcreatedDate" label="Timezone" v-model="timezone" :options="timeZoneOptions" map-options emit-label />

        <q-input  bottom-slots v-model="location" label="Location">
        <template v-slot:prepend>
          <q-icon name="place"></q-icon>
        </template>
      </q-input>

        <q-item
         clickable
            v-ripple
        >
          <q-item-section avatar>
            <q-icon name="repeat" size="sm" color="primary"></q-icon>
          </q-item-section>
          <q-item-section> Does not repeat </q-item-section>
          <q-item-section side>
        <q-icon color="primary" name="chevron_right" />
      </q-item-section>
        </q-item>

        <q-item
            clickable
            v-ripple
        >
          <q-item-section avatar>
            <q-icon name="alarm" size="sm" color="primary"></q-icon>
          </q-item-section>
          <q-item-section> Remind 30 minutes before </q-item-section>
          <q-item-section side>
        <q-icon color="primary" name="chevron_right" />
      </q-item-section>
        </q-item>

        <q-input
        name="eventDescription"
        class="q-mt-none"
        v-model="event.eventDescription"
        label="Event Note"
        placeholder="enter event note"></q-input>

        <div class="q-mt-lg"><label>Regarding:</label></div>
        <q-item class="q-mt-none">
          <q-item-section class="q-mr-sm" >
            <q-item-label>
              <q-select label="Contact" v-model="regardings" :options="timeZoneOptions" map-options emit-label />
            </q-item-label>
          </q-item-section>
          <q-item-section class="q-mr-sm">
            <q-item-label>
              <q-select label="Name" v-model="names" :options="timeZoneOptions" map-options emit-label />
            </q-item-label>
          </q-item-section>
          <q-item-section side>
        <q-icon color="primary" name="attach_file" />
      </q-item-section>
        </q-item>

        <q-item>
        <q-item-section avatar>
          <q-icon color="primary" name="group_add"></q-icon>
        </q-item-section>

        <!-- added a dialog section for add icon button  -->
        <q-item-section>
          <div>
            Attendees:
            <q-btn round size="sm" >
            <q-avatar color="primary" text-color="white" icon="add" size="sm" @click="dialog = true"></q-avatar>
          </q-btn>
          </div>
        </q-item-section>
      </q-item>

       <!--  print the selected attendees from dialog screen -->
       <div v-if="meeetingAttendees.length >= 1">
      <q-list dense v-for="item in meeetingAttendees" :key="item">
          <q-item >
            {{ item.name }}
          </q-item>
      </q-list>
    </div>


    <!-- display attendees names using chips but how to delete? the attendee -->

    <!-- <div v-if="meeetingAttendees.length >=1">
      <div v-for="item in meeetingAttendees" :key="item.id">
      <q-chip removable v-model="icecream">
            {{ item.name }}
      </q-chip>
    </div>
    </div> -->

      <div>


        <!-- impmenting dialog content here -->
        <q-dialog v-model="dialog" persistent>
      <q-card style="width: calc(100vw - 100px); height: 70vh;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Select attendees </div>
          <q-space></q-space>
          <q-btn icon="close" flat round dense v-close-popup></q-btn>
        </q-card-section>
        <q-card-section>
          <q-badge color="secondary" class="q-mb-md">
          Model: {{ meeetingAttendees || '[]' }}
        </q-badge>
          <q-select
          filled
          v-model="meeetingAttendees"
          multiple
          :options="dialogoptions"
          option-label="name"
          option-value="email"
          use-chips
          stack-label
          label="Select one or more attendees"
        ></q-select>
        </q-card-section>
        <!-- <q-card-section class="row items-center">
          <q-toggle v-model="cancelEnabled" label="Cancel button enabled"></q-toggle>
        </q-card-section> -->

        <!-- Notice v-close-popup -->
        <q-card-actions align="right">
          <!-- <q-btn flat label="Cancel" color="primary" v-close-popup="cancelEnabled" :disable="!cancelEnabled"></q-btn> -->
          <q-btn flat label="Add" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
      </div>
      </div>
    </div>
  </div>
</template>
