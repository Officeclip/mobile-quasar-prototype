<script setup>
import { ref, computed } from 'vue';

const options = ref([
  {
    id: '684EHRFDNJ8CHAGVJC5Q',
    name: 'Sample One',
    email: 'testmail1@gmail.com',
  },
  {
    id: 'NJ9MYHSFZB9RHHHFFC5Q',
    name: 'Sample Two',
    email: 'testmail2@gmail.com',
  },
  {
    id: 'U6BCWDSF266ESD9R545Q',
    name: 'Sample Three',
    email: 'testmail3@gmail.com',
  },
]);

const createdUser = { createdUserSid: '684EHRFDNJ8CHAGVJC5Q' };

const initialValue = ref({
  id: '684EHRFDNJ8CHAGVJC5Q',
  name: 'Sample One',
  email: 'testmail1@gmail.com',
});

const selectedOptions = ref([initialValue.value]);

const canBeRemoved = computed(
  () => (item) => item.id !== createdUser.createdUserSid
);

<<<<<<< HEAD
function handleRemove(item) {
  if (canBeRemoved.value(item)) {
    const index = selectedOptions.value.findIndex(
      (option) => option.id === item.id
    );
    if (index !== -1) {
      selectedOptions.value.splice(index, 1);
    }
  }
}
</script>

<template>
  <q-select
    v-model="selectedOptions"
    :options="options"
    class="full-width"
    input-debounce="0"
    label="Attendees"
    multiple
    option-label="email"
    option-value="id"
    style="min-width: 250px"
    use-input
  >
    <template v-slot:selected-item="scope">
      <q-chip
        removable
        dense
        @remove="handleRemove(scope.opt)"
        :tabindex="scope.tabindex"
        text-color="secondary"
        class="q-ma-none"
      >
        {{ scope.opt.name }}
      </q-chip>
    </template>
  </q-select>
=======
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
>>>>>>> 53221f8c6c18b47ab5d000c5a34420157d342f21
</template>
