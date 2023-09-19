<!-- eslint-disable vue/no-setup-props-destructure -->
<script lang="ts" setup>
import { computed, ref } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import EventsRecurrenceDialog from 'components/Events/EventsRecurrenceDialog.vue';
import EventsReminderDialog from 'components/Events/EventsReminderDialog.vue';

const props = defineProps(['event']);
const emit = defineEmits([
  'rrule-generated',
  'reminder-generated',
  'rrule-text-generated',
]);

const startDateTime = ref('');
const endDateTime = ref('');
const regardings = ref('');
const names = ref('');
const showTimeAs = ref('Free');
const repeatString = ref('Does not repeat');
const reminderTextInfo = ref('Choose Reminder');

const showAttendees = ref(false);
const showOptions = ref(false);

const iconName1 = ref('add');
const iconName2 = ref('add');

const toggleAttendees = () => {
  iconName1.value = showAttendees.value ? 'add' : 'remove';
  showAttendees.value = !showAttendees.value;
};

const toggleOptions = () => {
  iconName2.value = showOptions.value ? 'add' : 'remove';
  showOptions.value = !showOptions.value;
};

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

const formattedStartDateTime2 = startDateTime.value
  ? formattedStartDateTime
  : startDateTime;

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

const formattedEndDateTime2 = endDateTime.value
  ? formattedEndDateTime
  : endDateTime;

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
    label: 'GMT+0530(India Standard Time)',
  },
  {
    timezoneId: 2,
    label: 'GMT+0600(Central Asia Standard Time)',
  },
  {
    timezoneId: 3,
    label: 'GMT-0500(US Eastern Standard Time)',
  },
];

const labelOptions = ['Meeting', 'Picnic', 'Birthday', 'Payments', 'Testing'];
const ShowTimeOptions = ['Busy', 'Free', 'Tentative', 'Out of Office'];

const recurrenceDialogOpened = ref(false);
const reminderDialogOpened = ref(false);

function handleRRuleString(rruleString: string) {
  // You can now use the rruleString in your parent component
  console.log('Received RRule String:', rruleString);
  emit('rrule-generated', rruleString);
}

function handleRRuleText(rruleText: string) {
  console.log('Received RRule Plain Text:', rruleText);
  const repeatText = rruleText.charAt(0).toUpperCase() + rruleText.slice(1); //capitalize first letter
  repeatString.value = repeatText;
  emit('rrule-text-generated', repeatText);
}

function handleReminderData(reminderString: []) {
  // You can now use the rruleString in your parent component
  console.log('Received Reminder String:', reminderString);
  emit('reminder-generated', reminderString);
}

function handleReminderText(reminderText: string) {
  console.log('Received reminder Plain Text:', reminderText);
  reminderTextInfo.value = reminderText;
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
          :rules="[(val: string | any[]) => (val && val.length > 0) || 'Please type something']"
          label="Event Name"
          lazy-rules
          name="eventName"
          placeholder="enter event name"
        >
        </q-input>

        <q-toggle
          v-model="event.isAllDayEvent"
          :false-value="false"
          :true-value="true"
          color="primary"
          keep-color
          label="All Day Event"
          name="isAllDayEvent"
        />

        <q-input
          v-model="formattedStartDateTime2"
          :rules="[(val) => !!val || 'Start Date is required']"
          label="Start Date"
          name="startDateTime"
        >
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date v-model="startDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.event.isAllDayEvent" v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-time
                  v-if="!props.event.isAllDayEvent"
                  v-model="startDateTime"
                  :mask="maskDateTime"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          v-model="formattedEndDateTime2"
          :rules="[(val) => !!val || 'End Date is required']"
          label="End Date"
          name="endDateTime"
        >
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date v-model="endDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!props.event.isAllDayEvent" v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-time v-model="endDateTime" :mask="maskDateTime">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input v-model="event.eventLocation" bottom-slots label="Location">
          <template v-slot:prepend>
            <q-icon name="place" />
          </template>
        </q-input>
        <q-input
          v-model="event.eventDescription"
          class="q-mt-none"
          label="Event Note"
          name="eventDescription"
          placeholder="enter event description"
        />

        <q-item v-ripple clickable @click="recurrenceDialogOpened = true">
          <q-item-section avatar>
            <q-icon color="primary" name="repeat" size="sm" />
          </q-item-section>
          <q-item-section> {{ repeatString }}</q-item-section>
          <q-item-section side>
            <q-icon color="primary" name="chevron_right" />
          </q-item-section>
        </q-item>

        <q-item v-ripple clickable @click="reminderDialogOpened = true">
          <q-item-section avatar>
            <q-icon color="primary" name="alarm" size="sm" />
          </q-item-section>
          <q-item-section>{{ reminderTextInfo }}</q-item-section>
          <q-item-section side>
            <q-icon color="primary" name="chevron_right" />
          </q-item-section>
        </q-item>

        <q-btn
          :icon-right="iconName1"
          align="left"
          color="primary"
          flat
          label="Add Attendees"
          no-caps
          rounded
          size="md"
          @click="toggleAttendees"
        />

        <div v-if="showAttendees">
          <q-item> Test Meeting attendees </q-item>
        </div>

        <!-- toggle options here -->
        <q-btn
          :icon-right="iconName2"
          align="left"
          color="primary"
          flat
          label="Options"
          no-caps
          rounded
          size="md"
          @click="toggleOptions"
        />
        <div v-if="showOptions">
          <q-select
            v-model="event.timezone"
            :options="timeZoneOptions"
            emit-label
            label="Timezone"
            map-options
            name="timeZone"
          />
          <q-input v-model="event.url" label="Url" map-options name="Url">
            <template v-slot:append>
              <q-btn color="primary" dense flat label="test url" no-caps />
            </template>
          </q-input>
          <q-item>
            <q-item-section class="q-pr-xl">
              <q-select
                v-model="showTimeAs"
                :options="ShowTimeOptions"
                label="Show Time As"
                name="Show time as"
              />
            </q-item-section>
            <q-item-section>
              <q-select
                v-model="event.label"
                :options="labelOptions"
                label="Label"
                name="label"
                popup-content-style="backgroundColor: '#ff0000"
              />
            </q-item-section>
          </q-item>
        </div>
        <!-- <div v-if="showAttendees || showOptions">
          <q-separator/>
        </div> -->

        <div class="q-mt-lg"><label>Regarding:</label></div>
        <q-item class="q-mt-none">
          <q-item-section class="q-mr-sm">
            <q-item-label>
              <q-select
                v-model="regardings"
                :options="timeZoneOptions"
                emit-label
                label="Contact"
                map-options
              />
            </q-item-label>
          </q-item-section>
          <q-item-section class="q-mr-sm">
            <q-item-label>
              <q-select
                v-model="names"
                :options="timeZoneOptions"
                emit-label
                label="Name"
                map-options
              />
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon color="primary" name="switch_access_shortcut" />
          </q-item-section>
        </q-item>
        <q-dialog v-model="recurrenceDialogOpened">
          <EventsRecurrenceDialog
            @rrule-string-generated="handleRRuleString"
            @rrule-text-generated="handleRRuleText"
          />
        </q-dialog>
        <q-dialog v-model="reminderDialogOpened">
          <EventsReminderDialog
            @reminder-text-generated="handleReminderText"
            @reminder-data-generated="handleReminderData"
          />
        </q-dialog>
      </div>
    </div>
  </div>
</template>
