<script setup lang="ts">
import { defineProps, ref, onBeforeMount, Ref } from 'vue';
import { useContactListsStore } from '../../stores/contact/ContactListsStore';
import util from '../../helpers/util';
import UploadPhoto from '../general/UploadPhoto.vue';

// Define a common interface for select options
interface SelectOption {
  id: string | number;
  name: string;
  is_default?: boolean;
}

const props = defineProps(['fromParentData']);
const emit = defineEmits(['photo-updated']);
const contactDetails = ref(props?.fromParentData);

// Use clearer, typed variable names
const stateOptions = ref<SelectOption[]>([]);
const countryOptions = ref<SelectOption[]>([]);

const filteredStateOptions = ref<SelectOption[]>([]);
const filteredCountryOptions = ref<SelectOption[]>([]);

const usecontactListsStore = useContactListsStore();

onBeforeMount(async () => {
  await usecontactListsStore.getContactLists();
  countryOptions.value = usecontactListsStore.Countries;
  stateOptions.value = usecontactListsStore.States;

  // Initialize filtered lists with all options
  filteredCountryOptions.value = countryOptions.value;
  filteredStateOptions.value = stateOptions.value;

  if (!contactDetails.value?.id) {
    setDefaultValues();
  }
});

function setDefaultValues() {
  const findDefaultOption = (options: SelectOption[]) => {
    const defaultObj = options.find((option) => option.is_default);
    return defaultObj ? defaultObj.id : null;
  };
  contactDetails.value.state_id =
    findDefaultOption(stateOptions.value) || contactDetails.value.state_id;
  contactDetails.value.country_id =
    findDefaultOption(countryOptions.value) || contactDetails.value.country_id;
}

const lastNameRef = ref<any>(null);
const emailRef = ref<any>('');

const isLastNameValid = () => {
  const condition = contactDetails.value.last_name !== '';
  return condition ? true : 'Please enter your last name';
};

const isValidEmail = (val: string) => {
  const condition = util.isValidEmail(val, false);
  return condition ? true : 'Please enter a valid email address';
};

const validateAll = () => {
  lastNameRef.value.validate();
  emailRef.value.validate();
  return !lastNameRef.value.hasError && !emailRef.value.hasError;
};

// Generic function to create a filter handler for q-select
const createFilterFn = (
  sourceOptions: Ref<SelectOption[]>,
  filteredOptions: Ref<SelectOption[]>,
) => {
  return (val: string, update: (callback: () => void) => void) => {
    update(() => {
      if (val === '') {
        filteredOptions.value = sourceOptions.value;
      } else {
        const needle = val.toLowerCase();
        filteredOptions.value = sourceOptions.value.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1,
        );
      }
    });
  };
};

// Create specific filter functions using the generic creator
const filterCountriesFn = createFilterFn(
  countryOptions,
  filteredCountryOptions,
);
const filterStatesFn = createFilterFn(stateOptions, filteredStateOptions);

defineExpose({
  validateAll,
});

// Function to handle photo upload dialog
const showPhotoCtrl = ref(false);
const onPhotoSaved = (image: string) => {
  contactDetails.value.picture = image;
  emit('photo-updated', image);
  showPhotoCtrl.value = false;
};
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <!-- Photo Upload Button and UploadPhotot Dialog -->
      <div class="row items-center q-gutter-sm q-mb-md">
        <q-avatar size="90px" v-if="contactDetails.picture">
          <img :src="contactDetails.picture" alt="Contact Photo" />
        </q-avatar>
        <q-btn
          v-if="!showPhotoCtrl"
          color="primary"
          :label="contactDetails.picture ? 'Edit Photo' : 'Upload Photo'"
          @click="showPhotoCtrl = true"
          icon="photo_camera"
          flat
        />
        <upload-photo v-if="showPhotoCtrl" @photo-updated="onPhotoSaved" />
      </div>
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
        :options="filteredCountryOptions"
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
        :options="filteredStateOptions"
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
</template>
