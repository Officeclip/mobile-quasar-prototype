<!-- eslint-disable vue/no-setup-props-destructure -->
<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import {useEventsStore} from 'stores/EventsStore'
import EventsRecurrenceDialog from 'components/Events/EventsRecurrenceDialog.vue';

const props = defineProps(['event']);
const emit = defineEmits(['rrule-generated'])

const startDateTime = ref('');
const endDateTime = ref('');
// const timezone = ref('');
// const location = ref('');
const regardings = ref('');
const names = ref('')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const meeetingAttendees: any = ref([])
// const labels = ref('Meeting')
// const url = ref('')
// const recurrenceString = ref('');
const repeatString = ref('Does not repeat');
const showAttendees = ref(false);
const showOptions = ref(false)

const iconName1 = ref('add');
const iconName2 = ref('add');


const toggleAttendees = () => {
  iconName1.value = showAttendees.value ? 'add' : 'remove'
  showAttendees.value = !showAttendees.value;
  // showAttendees.value ? meeetingAttendees.value = [] : meeetingAttendees.value
  // eslint-disable-next-line vue/no-mutating-props
  // showAttendees.value ? props.event.meeetingAttendees.value = [] : props.event.meeetingAttendees
}

const toggleOptions = () => {
  iconName2.value = showOptions.value ? 'add' : 'remove'
  showOptions.value = !showOptions.value;
}

const eventsStore = useEventsStore();
onMounted(() => {
  eventsStore.getAllMeetingAttendees()
});

const meetingAttendees = computed(() => {
  return eventsStore.MeetingAttendees
});

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
    label: 'GMT+0530(India Standard Time)'
  },
  {
    timezoneId: 2,
    label: 'GMT+0600(Central Asia Standard Time)'
  },
  {
    timezoneId: 3,
    label: 'GMT-0500(US Eastern Standard Time)'
  }
]

const labelOptions = [
  {label: 'None'},
  {label: 'Meeting'},
  {label: 'Picnic'},
  {label: 'Birthday'},
  {label: 'Testing'}
]

const alert = ref(false);

function handleRRuleString(rruleString: string) {
  // You can now use the rruleString in your parent component
  console.log('Received RRule String:', rruleString);
  emit('rrule-generated', rruleString);
}

function handleRRuleText(rruleText: string) {
  console.log('Received RRule Plain Text:', rruleText);
  const capitalizedText= rruleText.charAt(0).toUpperCase() + rruleText.slice(1);
  repeatString.value = capitalizedText;
}
</script>

<template>
  <!-- FIXME: remove the warning -->
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input
            v-model="event.eventName"
            :rules="[(val) => (val && val.length > 0) || 'Please type something']"
            label="Event Name"
            lazy-rules
            name="eventName"
            placeholder="enter event name">
        </q-input>

        <q-toggle
            v-model="event.isAllDayEvent"
            :false-value='false'
            :true-value='true'
            color="primary"
            keep-color
            label="All Day Event"
            name="isAllDayEvent"></q-toggle>

        <q-input
            v-model="formattedStartDateTime2"
            label="Start Date"
            name="startDateTime">
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                <q-date v-model="startDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close"></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.event.isAllDayEvent" v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                <q-time v-if="!props.event.isAllDayEvent" v-model="startDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close"></q-btn>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
            v-model="formattedEndDateTime2"
            label="End Date"
            name="endDateTime">
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                <q-date v-model="endDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close"></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.event.isAllDayEvent" v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                <q-time v-model="endDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close"></q-btn>
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input v-model="event.location" bottom-slots label="Location">
          <template v-slot:prepend>
            <q-icon name="place"/>
          </template>
        </q-input>
        <q-input
            v-model="event.eventDescription"
            class="q-mt-none"
            label="Event Note"
            name="eventDescription"
            placeholder="enter event description"/>

        <q-item
            v-ripple
            clickable
            @click="alert = true"
        >
          <q-item-section avatar>
            <q-icon color="primary" name="repeat" size="sm"/>
          </q-item-section>
          <q-item-section> {{ repeatString }}</q-item-section>
          <q-item-section side>
            <q-icon color="primary" name="chevron_right"/>
          </q-item-section>
        </q-item>

        <q-item
            v-ripple
            clickable
        >
          <q-item-section avatar>
            <q-icon color="primary" name="alarm" size="sm"/>
          </q-item-section>
          <q-item-section> Remind 30 minutes before</q-item-section>
          <q-item-section side>
            <q-icon color="primary" name="chevron_right"/>
          </q-item-section>
        </q-item>

        <q-btn
            align="left"
            color="primary"
            flat
            :icon-right= iconName1
            label="Add Attendees"
            no-caps
            rounded
            size="md"
            @click="toggleAttendees"></q-btn>

        <div v-if="showAttendees">
          <q-select
              v-model="event.meetingAttendees"
              :options="meetingAttendees"
              dense
              filled
              label="Select from dropdown"
              multiple
              option-label="name"
              option-value="email"
              outlined
              transition-hide="scale"
              transition-show="scale"
              use-chips
          >
          </q-select>
        </div>

        <!-- toggle options here -->
        <q-btn
            align="left"
            color="primary"
            flat
            :icon-right= iconName2
            label="Options"
            no-caps
            rounded
            size="md"
            @click="toggleOptions"></q-btn>
        <div v-if="showOptions">

        <q-select v-model="event.timezone"
        :options="timeZoneOptions"
        emit-label
        label="Timezone"
        map-options
        name="timeZone"/>

        <q-select v-model="event.label"
        :options="labelOptions"
        map-options
        emit-label
        label="Label"
        name="label"/>

        <q-input v-model="event.url"
        label="Url"
        map-options
        name="Url">
        <template v-slot:append>
          <q-btn
          flat
          dense
          no-caps
          color="primary"
          label="test url"></q-btn>
        </template>
      </q-input>

        </div>
        <!-- <div v-if="showAttendees || showOptions">
          <q-separator/>
        </div> -->


        <div class="q-mt-lg"><label>Regarding:</label></div>
        <q-item class="q-mt-none">
          <q-item-section class="q-mr-sm">
            <q-item-label>
              <q-select v-model="regardings" :options="timeZoneOptions" emit-label label="Contact" map-options/>
            </q-item-label>
          </q-item-section>
          <q-item-section class="q-mr-sm">
            <q-item-label>
              <q-select v-model="names" :options="timeZoneOptions" emit-label label="Name" map-options/>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon color="primary" name="attach_file"/>
          </q-item-section>
        </q-item>
        <q-dialog v-model="alert">
          <EventsRecurrenceDialog @rrule-string-generated="handleRRuleString" @rrule-text-generated="handleRRuleText"/>
        </q-dialog>

      </div>
    </div>
  </div>
</template>
