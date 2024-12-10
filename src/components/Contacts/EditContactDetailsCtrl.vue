<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { defineProps, ref, onBeforeMount, computed } from 'vue';
import { useContactDetailsStore } from '../../stores/contact/ContactDetailsStore';
import util from '../../helpers/util';

const props = defineProps(['fromParentData']);
const contactDetails = ref(props?.fromParentData);

const dense = ref(false);

const usecontactDetailsStore = useContactDetailsStore();

const getStates = computed(() => {
  return usecontactDetailsStore.states;
});

const defaultState = computed(() => {
  return getStates.value.find((state) => state.is_default);
});

const updateState = (newValue) => {
  contactDetails.value.state_id = newValue.id;
  contactDetails.value.state_name = newValue.name;
};

const getCountries = computed(() => {
  return usecontactDetailsStore.countries;
});

const updateCountry = (newValue) => {
  contactDetails.value.country_id = newValue.id;
  contactDetails.value.country_name = newValue.name;
};

const defaultCountry = computed(() => {
  return getCountries.value.find((country) => country.is_default);
});

onBeforeMount(async () => {
  await usecontactDetailsStore.getContactLists();
  if (
    contactDetails.value?.id == '' &&
    defaultState.value?.is_default == true
  ) {
    contactDetails.value.state_name = defaultState.value.name;
    contactDetails.value.state_id = defaultState.value.id;
  }
  if (
    contactDetails.value?.id == '' &&
    defaultCountry.value?.is_default == true
  ) {
    contactDetails.value.country_id = defaultCountry.value?.id;
    contactDetails.value.country_name = defaultCountry.value?.name;
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
          :dense="dense"
        ></q-input>
        <q-input
          v-model="contactDetails.last_name"
          label="Last Name"
          placeholder="enter last name"
          :dense="dense"
          :rules="[isLastNameValid]"
          ref="lastNameRef"
        >
        </q-input>
        <q-input
          v-model="contactDetails.title"
          label="Title"
          placeholder="enter title"
          :dense="dense"
        ></q-input>
        <q-input
          v-model="contactDetails.email"
          label="Email"
          placeholder="enter email address"
          :dense="dense"
          :rules="[isValidEmail]"
          ref="emailRef"
        ></q-input>
        <q-select
          v-model="contactDetails.country_name"
          @update:model-value="updateCountry"
          option-value="id"
          option-label="name"
          :options="getCountries"
          label="Country"
          placeholder="enter country name"
          :dense="dense"
        ></q-select>
        <q-input
          v-model="contactDetails.work_phone"
          label="Work Phone"
          placeholder="work phone"
          :dense="dense"
        ></q-input>
        <q-input
          v-model="contactDetails.home_phone"
          label="Home Phone"
          placeholder="home phone"
          :dense="dense"
        ></q-input>
        <q-input
          v-model="contactDetails.street_address"
          label="Address"
          placeholder="street address"
          :dense="dense"
        ></q-input>
        <q-input
          v-model="contactDetails.city"
          label="City"
          placeholder="City"
          :dense="dense"
        ></q-input>
        <q-select
          v-model="contactDetails.state_name"
          @update:model-value="updateState"
          option-value="id"
          option-label="name"
          :options="getStates"
          label="State"
          placeholder="enter state name"
          :dense="dense"
        />
        <q-input
          v-model="contactDetails.postal_code"
          label="Postal Code"
          placeholder="postal code"
          :dense="dense"
        ></q-input>
      </div>
    </div>
  </div>
</template>
