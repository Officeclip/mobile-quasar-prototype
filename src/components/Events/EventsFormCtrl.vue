<!-- eslint-disable vue/no-setup-props-destructure -->
<script lang="ts" setup>
import { computed, ref } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import EventsRecurrenceDialog from 'components/Events/EventsRecurrenceDialog.vue';
import EventsReminderDialog from 'components/Events/EventsReminderDialog.vue';
// import EventsAddAttendeesDialog from './EventsAddAttendeesDialog.vue';

const props = defineProps(['event', 'meetingAttendeesList']);
const emit = defineEmits([
  'rrule-generated',
  'reminder-generated',
  'rrule-text-generated',
  'selectedAttendeesP',
]);

const startDateTime = ref('');
const endDateTime = ref('');
const regardings = ref('');
const names = ref('');
const showTimeAs = ref('Free');
const repeatString = ref('Does not repeat');
const reminderTextInfo = ref('Reminder');

// const showOptions = ref(false);

// const toggleIcon = ref('add');

/* const toggleOptions = () => {
  toggleIcon.value = showOptions.value ? 'add' : 'remove';
  showOptions.value = !showOptions.value;
}; */

startDateTime.value = props.event.startDateTime;
endDateTime.value = props.event.endDateTime;

// const formattedStartDateTime = computed(() => {
//   console.log('TestDuttaForm: allDay value:', props.event.isAllDayEvent);
//   let dateValue = dateTimeHelper.extractDateFromUtc(startDateTime.value);
//   let timeValue = dateTimeHelper.extractTimeFromUtc(startDateTime.value);
//   if (props.event.isAllDayEvent) {
//     return dateValue;
//   } else {
//     return `${dateValue} ${timeValue}`;
//   }
// });
//
// const formattedStartDateTime2 = startDateTime.value
//   ? formattedStartDateTime
//   : startDateTime;
//
// const formattedEndDateTime = computed(() => {
//   console.log('TestDuttaForm: allDay value:', props.event.isAllDayEvent);
//   let dateValue = dateTimeHelper.extractDateFromUtc(endDateTime.value);
//   let timeValue = dateTimeHelper.extractTimeFromUtc(endDateTime.value);
//   if (props.event.isAllDayEvent) {
//     return dateValue;
//   } else {
//     return `${dateValue} ${timeValue}`;
//   }
// });
//
// const formattedEndDateTime2 = endDateTime.value
//   ? formattedEndDateTime
//   : endDateTime;

const formattedStartDateTime = computed(() => {
  console.log('TestDuttaForm: allDay value:', props.event.isAllDayEvent);
  return startDateTime.value;
});

const formattedStartDateTime2 = startDateTime.value
  ? formattedStartDateTime
  : startDateTime;

const formattedEndDateTime = computed(() => {
  console.log('TestDuttaForm: allDay value:', props.event.isAllDayEvent);
  return endDateTime.value;
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

const meetingAttendeesOptions = props.meetingAttendeesList;
const filterOptions = ref(meetingAttendeesOptions);

function filterFn(val: any, update: any) {
  // Filter the meetingAttendeesOptions array based on the search value.
  update(() => {
    if (val === '') {
      filterOptions.value = meetingAttendeesOptions;
    } else {
      const needle = val.toLowerCase();
      filterOptions.value = meetingAttendeesOptions.filter(
        (v: any) => v.name.toLowerCase().indexOf(needle) > -1
      );
    }
  });
}

function createValue(val: any, done: any) {
  // create a new id value to add the id property for the new input string from user
  const id = Math.round(Math.random() * 100);
  // Add the new item to the meetingAttendeesOptions array.
  if (val.length > 0) {
    if (!meetingAttendeesOptions.includes(val)) {
      meetingAttendeesOptions.push({
        id: id,
        email: val,
        name: '',
      }); // push the new item as an object into the list
    }
    done({ id: id, email: val }, 'toggle'); // added the new input as an new item into the dropdown
  }
}
</script>

<template>
  <!-- FIXME: remove the warning -->
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-list>
          <q-item>
            <q-input
              class="full-width"
              v-model="event.eventName"
              :rules="[(val: string | any[]) => (val && val.length > 0) || 'Please type something']"
              label="Event Name*"
              lazy-rules
              name="eventName"
              placeholder="enter event name"
            />
          </q-item>
          <q-card>
            <q-item>
              <q-toggle
                v-model="event.isAllDayEvent"
                :false-value="false"
                :true-value="true"
                color="primary"
                keep-color
                label="All Day Event"
                name="isAllDayEvent"
                left-label
                dense
              />
            </q-item>
            <q-item class="rowItems">
              <q-item-section>
                <q-input
                  v-model="formattedStartDateTime2"
                  :rules="[(val: any) => !!val || 'Start Date is required']"
                  label="Starts*"
                  name="startDateTime"
                  dense
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
                            <q-btn
                              v-close-popup
                              color="primary"
                              flat
                              label="Close"
                            />
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
                            <q-btn
                              v-close-popup
                              color="primary"
                              flat
                              label="Close"
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item-section>
              <q-item-section>
                <q-input
                  v-model="formattedEndDateTime2"
                  :rules="[(val: any) => !!val || 'End Date is required']"
                  label="Ends*"
                  name="endDateTime"
                  dense
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
                            <q-btn
                              v-close-popup
                              color="primary"
                              flat
                              label="Close"
                            />
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
                            <q-btn
                              v-close-popup
                              color="primary"
                              flat
                              label="Close"
                            />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-item-section>
            </q-item>
            <q-item v-ripple clickable @click="recurrenceDialogOpened = true">
              <q-item-section avatar>
                <q-icon color="primary" name="repeat" size="sm" />
              </q-item-section>
              <q-item-section> {{ repeatString }}</q-item-section>
              <q-item-section side>
                <q-icon color="primary" name="chevron_right" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-select
                class="full-width"
                v-model="regardings"
                :options="timeZoneOptions"
                emit-label
                label="Timezone"
                map-options
              />
            </q-item>
          </q-card>
          <q-item>
            <q-select
              class="full-width q-mt-sm"
              filled
              v-model="event.meetingAttendees"
              use-input
              use-chips
              multiple
              input-debounce="0"
              @new-value="createValue"
              :options="filterOptions"
              option-label="email"
              option-value="id"
              @filter="filterFn"
              label="Attendees"
              style="min-width: 250px"
            ></q-select>
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

          <q-card>
            <q-item>
              <q-input
                class="full-width"
                v-model="event.eventLocation"
                bottom-slots
                label="Location"
                placeholder="enter where the event will take place"
                dense
              >
              </q-input>
            </q-item>
            <q-item>
              <q-input
                v-model="event.eventDescription"
                class="q-mt-none full-width"
                label="Notes"
                name="eventDescription"
                placeholder="enter event description"
                dense
                autogrow
              />
            </q-item>
            <q-item>
              <q-input
                dense
                class="full-width"
                v-model="event.url"
                label="Url"
                map-options
                name="Url"
              >
                <template v-slot:append>
                  <q-btn color="primary" dense flat label="test url" no-caps />
                </template>
              </q-input>
            </q-item>
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
          </q-card>

          <q-item class="q-mt-md text-subtitle1">Regarding</q-item>
          <q-item class="q-mt-none">
            <q-item-section class="q-mr-sm">
              <q-select
                dense
                v-model="regardings"
                :options="timeZoneOptions"
                emit-label
                label="Contact"
                map-options
              />
            </q-item-section>
            <q-item-section class="q-mr-sm">
              <q-select
                dense
                v-model="names"
                :options="timeZoneOptions"
                emit-label
                label="Name"
                map-options
              />
            </q-item-section>
            <q-item-section side>
              <q-icon color="primary" name="switch_access_shortcut" />
            </q-item-section>
          </q-item>
        </q-list>

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
<style scoped>
.rowItems {
  display: flex;
  gap: 32px;
}
</style>
