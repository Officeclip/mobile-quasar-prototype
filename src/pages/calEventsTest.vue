<script setup>
import { ref } from 'vue';
import dateTimeHelper from '../helpers/dateTimeHelper';

const start = ref('2024-04-10T11:50:07Z');
const startsModelValue = ref(
  dateTimeHelper.extractDateandTimeFromUtc(start.value, false)
);
</script>

<template>
  <div id="q-app" style="min-height: 100vh">
    <div class="q-pa-md" style="max-width: 300px">
      <pre>{{ startsModelValue }}</pre>
      <q-input v-model="startsModelValue" label="Starts*">
        <template v-slot:prepend>
          <q-icon class="cursor-pointer" name="event">
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale"
            >
              <q-date v-model="startsModelValue" mask="ddd, MMM D, YYYY HH:mm">
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
              <q-time v-model="startsModelValue" mask="ddd, MMM D, YYYY HH:mm">
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
