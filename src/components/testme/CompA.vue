<script lang="ts" setup>
import dateTimeHelper from 'src/helpers/dateTimeHelper';
import { ref, watch, computed } from 'vue';

const inputValue = ref('');
const startDate = ref('');
const endDate = ref('');
const nameRef = ref(null);
const dateRef = ref(null);

const isAllDay = ref(true);
const endDateModelValue = ref('');
endDateModelValue.value = dateTimeHelper.formatDateTimeFromRestAPIForUI(
  endDate.value,
  isAllDay.value
);

const validateAll = () => {
  // var val =
  //   ruleNotEmpty(inputValue.value) &
  //   ruleNotEmpty(endDateModelValue.value) &
  //   ruleEndDateGreaterThanStartDate(endDateModelValue.value);
  // return val == true;
  nameRef.value.validate();
  dateRef.value.validate();
  return nameRef.value.hasError || dateRef.value.hasError;
  // if (nameRef.value.hasError || dateRef.value.hasError) {
  //   return false;
  // } else {
  //   return true;
  // }
};

defineExpose({
  validateAll,
});

const ruleNotEmpty = (val: string) => {
  const condition = val && val.length > 0;
  return condition ? true : 'Please enter something';
};

const ruleEndDateGreaterThanStartDate = (val: string) => {
  console.log(`startDate: ${startDate.value}, endDate: ${val}`);
  if (!startDate.value || startDate.value.length === 0) return true;
  const isGreater = new Date(val) > new Date(startDate.value);
  return isGreater ? true : 'End Date should be more than start date';
};

const dateTimeMask = 'ddd, MMM DD, YYYY hh:mm A';
const dateMask = 'ddd, MMM DD, YYYY';
const mask = (x: boolean) => {
  return x ? dateMask : dateTimeMask;
};
</script>

<template>
  <div>
    <q-input
      ref="nameRef"
      v-model="inputValue"
      label="Event Name*"
      placeholder="enter event name"
      :rules="[ruleNotEmpty]"
    />
  </div>
  <div>
    <label for="startDate">Start Date:</label>
    <input id="startDate" type="date" v-model="startDate" />
  </div>
  <div>
    <label for="endDate">End Date:</label>
    <q-input
      ref="dateRef"
      v-model="endDateModelValue"
      label="Ends*"
      :rules="[ruleNotEmpty, ruleEndDateGreaterThanStartDate]"
    >
      <template v-slot:prepend>
        <q-icon class="cursor-pointer" name="event">
          <q-popup-proxy cover transition-hide="scale" transition-show="scale">
            <q-date v-model="endDateModelValue" :mask="mask(isAllDay)">
              <div class="row items-center justify-end">
                <q-btn v-close-popup color="primary" flat label="Close" />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-if="!isAllDay" v-slot:append>
        <q-icon class="cursor-pointer" name="access_time">
          <q-popup-proxy cover transition-hide="scale" transition-show="scale">
            <q-time v-model="endDateModelValue" :mask="mask(isAllDay)">
              <div class="row items-center justify-end">
                <q-btn v-close-popup color="primary" flat label="Close" />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>
