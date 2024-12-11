<script setup>
import { defineProps, ref, onBeforeMount, watch } from 'vue';
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import util from '../../helpers/util';

const props = defineProps(['fromParentData']);
const contactDetails = ref(props?.fromParentData);

const getStates = ref(null);
const defaultState = ref(null);

const getCountries = ref(null);
const defaultCountry = ref(null);

const filterCountries = ref(null);
const filterStates = ref(null);

const usecontactDetailsStore = useContactDetailsStore();

// const getStates = computed(() => {
//   return usecontactDetailsStore.states;
// });

// const defaultState = computed(() => {
//   return getStates.value.find((state) => state.is_default);
// });

// const getCountries = computed(() => {
//   return usecontactDetailsStore.countries;
// });

// const defaultCountry = computed(() => {
//   return getCountries.value.find((country) => country.is_default);
// });

onBeforeMount(async () => {
  await usecontactDetailsStore.getContactLists();
  getCountries.value = usecontactDetailsStore.countries;
  defaultCountry.value = getCountries.value.find(
    (country) => country.is_default
  );
  getStates.value = usecontactDetailsStore.states;
  defaultState.value = getStates.value.find((state) => state.is_default);

  filterCountries.value = getCountries.value;
  filterStates.value = getStates.value;

  if (
    contactDetails.value?.id == '' &&
    defaultState.value?.is_default == true
  ) {
    contactDetails.value.state_id = defaultState.value.id;
  }
  if (
    contactDetails.value?.id == '' &&
    defaultCountry.value?.is_default == true
  ) {
    contactDetails.value.country_id = defaultCountry.value?.id;
  }
});

const lastNameRef = ref(null);
const emailRef = ref('');

const isLastNameValid = () => {
  const condition = contactDetails.value.last_name !== '';
  return condition ? true : 'Please enter your last name';
};

const isValidEmail = (val) => {
  const condition = util.isValidEmail(val, false);
  return condition ? true : 'Please enter a valid email address';
};

const validateAll = () => {
  lastNameRef.value.validate();
  emailRef.value.validate();
  return !lastNameRef.value.hasError && !emailRef.value.hasError;
};

function filterCountriesFn(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    filterCountries.value = getCountries.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

function filterStatesFn(val, update) {
  update(() => {
    const needle = val.toLowerCase();
    filterStates.value = getStates.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
}

defineExpose({
  validateAll,
});
</script>

<template>
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input
          v-model="contactDetails.first_name"
          label="First Name"
          placeholder="enter first name"
          dense
        ></q-input>
        <q-input
          v-model="contactDetails.last_name"
          label="Last Name"
          placeholder="enter last name"
          dense
          :rules="[isLastNameValid]"
          hide-bottom-space
          ref="lastNameRef"
        >
        </q-input>
        <q-input
          v-model="contactDetails.title"
          label="Title"
          placeholder="enter title"
          dense
        ></q-input>
        <q-input
          v-model="contactDetails.email"
          label="Email"
          placeholder="enter email address"
          dense
          :rules="[isValidEmail]"
          hide-bottom-space
          ref="emailRef"
        ></q-input>
        <q-select
          v-model="contactDetails.country_id"
          :options="filterCountries"
          label="Country"
          dense
          option-value="id"
          option-label="name"
          map-options
          emit-value
          use-input
          fill-input
          hide-selected
          input-debounce="0"
          @filter="filterCountriesFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> not found</q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          v-model="contactDetails.work_phone"
          label="Work Phone"
          placeholder="work phone"
          dense
        ></q-input>
        <q-input
          v-model="contactDetails.home_phone"
          label="Home Phone"
          placeholder="home phone"
          dense
        ></q-input>
        <q-input
          v-model="contactDetails.street_address"
          label="Address"
          placeholder="street address"
          dense
        ></q-input>
        <q-input
          v-model="contactDetails.city"
          label="City"
          placeholder="City"
          dense
        ></q-input>
        <q-select
          v-model="contactDetails.state_id"
          :options="filterStates"
          label="State"
          dense
          option-value="id"
          option-label="name"
          map-options
          emit-value
          use-input
          fill-input
          hide-selected
          input-debounce="0"
          @filter="filterStatesFn"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> not found</q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          v-model="contactDetails.postal_code"
          label="Postal Code"
          placeholder="postal code"
          dense
        ></q-input>
      </div>
    </div>
  </div>
</template>
