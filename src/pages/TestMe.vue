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

// const handleValidation = (valid: boolean) => {
//   console.log(`handleValidation: ${isValid.value}`);
//   isValid.value = valid;
// };

const onSubmit = () => {
  const strDate = dateTimeHelper.formatDateTimeFromUIForRestAPI(
    startDateModelValue.value,
    isAllDayEvent
  );
  // const dt = new Date(startDateModelValue.value);

  // var strDate = !isAllDayEvent
  //   ? dt.toISOString().replace(/.\d+Z$/g, 'Z')
  //   : dateTimeHelper.formatDateForGeneric(dt);
  //dt.setSeconds(0, 0);
  console.log(`onSubmit: ${strDate}`);
  // if (isValid.value) {
  //   alert('Form submitted successfully! ' + current.value);
  // } else {
  //   alert('Please correct the errors in the form.');
  // }
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
                >
                  <div class="row items-center justify-end">
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
        <q-btn
          class="q-ml-sm"
          color="primary"
          flat
          label="Submit"
          no-caps
          type="submit"
        />
        <button id="external-button" @click="onSave">External Button</button>
      </div>
    </q-form>
  </div>
</template>
