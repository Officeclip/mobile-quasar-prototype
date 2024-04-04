<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { defineProps, ref, onMounted, onBeforeMount, computed } from 'vue';
import { useContactDetailsStore } from 'stores/ContactDetailsStore';

const props = defineProps(['contactDetails']);

const dense = ref(false);

const usecontactDetailsStore = useContactDetailsStore();

const getStates = computed(() => {
  return usecontactDetailsStore.states;
});

const defaultState = computed(() => {
  return getStates.value.find((state) => state.is_default);
});

const updateState = (newValue) => {
  props.contactDetails.state_id = newValue.id;
  props.contactDetails.state_name = newValue.name;
};

const getCountries = computed(() => {
  return usecontactDetailsStore.countries;
});

const updateCountry = (newValue) => {
  props.contactDetails.country_id = newValue.id;
  props.contactDetails.country_name = newValue.name;
};

const defaultCountry = computed(() => {
  return getCountries.value.find((country) => country.is_default);
});

onBeforeMount(async () => {
  await usecontactDetailsStore.getContactLists();
  if (props.contactDetails?.id == '' && defaultState.value?.is_default == true) {
    props.contactDetails.state_name = defaultState.value.name;
    props.contactDetails.state_id = defaultState.value.id;
  }
  if (props.contactDetails?.id == '' && defaultCountry.value?.is_default == true) {
    props.contactDetails.country_id = defaultCountry.value?.id;
    props.contactDetails.country_name = defaultCountry.value?.name;
  }
});

// onMounted(() => {
//   //usecontactDetailsStore.getContactLists();
//   if (props.contactDetails?.id == 0 && defaultState.value?.is_default == true) {
//     props.contactDetails.state_name = defaultState.value.name;
//     props.contactDetails.state_id = defaultState.value.id;
//   }
//   if (props.contactDetails?.id == 0 && defaultCountry.value?.is_default == true) {
//     props.contactDetails.country_name = defaultCountry.value.name;
//     props.contactDetails.country_id = defaultCountry.value.id;
//   }
// });

// watch(
//   [defaultState, defaultCountry],
//   ([newDefaultState, newDefaultCountry]) => {
//     if (props.contactDetails?.id == 0 && newDefaultState.value?.is_default == true) {
//       props.contactDetails.state_name = newDefaultState.value.name;
//       props.contactDetails.state_id = newDefaultState.value.id;
//     }
//     if (props.contactDetails?.id == 0 && newDefaultCountry.value?.is_default == true) {
//       props.contactDetails.country_name = newDefaultCountry.value.name;
//       props.contactDetails.country_id = newDefaultCountry.value.id;
//     }
//   }
// );
</script>

<template>
  <!-- FIXME: remove the warning -->
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input v-model="contactDetails.first_name" label="First Name *" placeholder="enter first name" :dense="dense"
          lazy-rules :rules="[
          // (val) => (val && val.length > 0) || 'Please enter your first name',
        ]"></q-input>
        <q-input v-model="contactDetails.last_name" label="Last Name" placeholder="enter last name"
          :dense="dense"></q-input>
        <q-input v-model="contactDetails.title" label="Title" placeholder="enter title" :dense="dense"></q-input>
        <q-input v-model="contactDetails.email" label="Email" placeholder="enter email address"
          :dense="dense"></q-input>
        <q-select v-model="contactDetails.country_name" @update:model-value="updateCountry" option-value="id"
          option-label="name" :options="getCountries" label="Country" placeholder="enter country name"
          :dense="dense"></q-select>
        <q-input v-model="contactDetails.work_phone" label="Work Phone" placeholder="work phone"
          :dense="dense"></q-input>
        <q-input v-model="contactDetails.home_phone" label="Home Phone" placeholder="home phone"
          :dense="dense"></q-input>
        <q-input v-model="contactDetails.street_address" label="Address" placeholder="street address"
          :dense="dense"></q-input>
        <q-input v-model="contactDetails.city" label="City" placeholder="City" :dense="dense"></q-input>
        <q-select v-model="contactDetails.state_name" @update:model-value="updateState" option-value="id"
          option-label="name" :options="getStates" label="State" placeholder="enter state name" :dense="dense" />
        <q-input v-model="contactDetails.postal_code" label="Postal Code" placeholder="postal code"
          :dense="dense"></q-input>
      </div>
    </div>
  </div>
</template>
