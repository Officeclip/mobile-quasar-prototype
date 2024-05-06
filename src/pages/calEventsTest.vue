<script setup>
import { ref, computed, watch } from 'vue';
import dateTimeHelper from '../helpers/dateTimeHelper';
import { parse, format } from 'date-fns';

// const startDateTime = ref(props.event.startDateTime);
const start = ref('2024-04-10T11:50:07Z');
const startDate = ref('');
const startsModelValue = ref(
  dateTimeHelper.extractDateandTimeFromUtc(start.value, false)
);

const ffffValue = ref('');
// const originalDateString = '2024-05-30 18:50';
// const parsedDate = computed(() => {
//   return parse(originalDateString, 'yyyy-MM-dd HH:mm', new Date());
// });

// const formattedDate = computed(() => {
//   return format(parsedDate.value, 'EEE, MMM dd, yyyy hh:mm aa');
// });

watch([startDate], ([newStartDate]) => {
  const parsedDate = parse(newStartDate, 'yyyy-MM-dd HH:mm', new Date());
  const formattedDate = format(parsedDate, 'EEE, MMM dd, yyyy hh:mm aa');
  ffffValue.value = formattedDate;
  startsModelValue.value = formattedDate;
});
</script>

<template>
  <div id="q-app" style="min-height: 100vh">
    <div class="q-pa-md" style="max-width: 300px">
      <pre>{{ startDate }}</pre>
      <pre>{{ ffffValue }}</pre>
      <q-input v-model="startsModelValue" label="Starts*">
        <template v-slot:prepend>
          <q-icon class="cursor-pointer" name="event">
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale"
            >
              <q-date v-model="startDate" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat label="Close" />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon class="cursor-pointer" name="access_time">
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale"
            >
              <q-time v-model="startDate" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat label="Close" />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>
