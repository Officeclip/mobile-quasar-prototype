<script lang="ts" setup>
import { ref } from 'vue';
import CompA from '../../src/components/testme/CompA.vue';
import dateTimeHelper from '../helpers/dateTimeHelper';

const current = ref('test');
const isValid = ref(false);

const startDateTime = '2024-07-25T21:00:00Z';
const isAllDayEvent = false;

// const startDateTime = '2024-07-25';
// const isAllDayEvent = true;

const startDateModelValue = ref();
startDateModelValue.value = dateTimeHelper.formatDateTimeFromRestAPIForUI(
  startDateTime,
  isAllDayEvent
);

const onSubmit = () => {
  console.log();
  const strDate = dateTimeHelper.formatDateTimeFromUIForRestAPI(
    startDateModelValue.value,
    isAllDayEvent
  );
  console.log(`onSubmit: ${strDate}`);
};

const dateTimeMask = 'ddd, MMM DD, YYYY hh:mm A';
const dateMask = 'ddd, MMM DD, YYYY';
const mask = (x: boolean) => {
  return x ? dateMask : dateTimeMask;
};

const childComponent = ref(null);
const onSave = () => {
  alert(childComponent.value.validateAll());
};
</script>

<template>
  <div class="demo">
    <q-form class="q-gutter-md" @submit="onSubmit">
      <div>
        <pre>startDateModelValue = {{ startDateModelValue }}</pre>
        <q-input v-model="startDateModelValue" label="Starts*" readonly>
          <template v-slot:prepend>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date
                  v-model="startDateModelValue"
                  :mask="mask(isAllDayEvent)"
                  ><div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-if="!isAllDayEvent" v-slot:append>
            <q-icon class="cursor-pointer" name="access_time">
              <q-popup-proxy
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-time
                  v-model="startDateModelValue"
                  :mask="mask(isAllDayEvent)"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <CompA :current="current" ref="childComponent" />
      </div>
    </q-form>
    <div>
      <q-btn
        class="q-ml-sm"
        color="primary"
        flat
        label="Submit"
        no-caps
        type="submit"
      />
      <q-btn id="external-button" @click="onSave">External Button</q-btn>
    </div>
  </div>
</template>
