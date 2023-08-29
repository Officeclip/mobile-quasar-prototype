<script setup>
import { defineProps, ref, onMounted, computed } from 'vue';
import { useContactsStore } from '../../stores/ContactsStore';

defineProps(['contact']);

const dense = ref(false);

const usecontactStore = useContactsStore();

usecontactStore.getStates();

onMounted(() => {
  // not defined
});

const getStateNames = computed(() => {
  const names = usecontactStore.states.map((a) => a.name);
  return names;
});
</script>

<template>
  <!-- FIXME: remove the warning -->
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <div class="q-pa-md">
      <div class="q-gutter-y-md column">
        <q-input
          v-model="contact.first_name"
          label="First Name *"
          placeholder="enter first name"
          :dense="dense"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter your first name',
          ]"
        ></q-input>
        <q-input
          v-model="contact.last_name"
          label="Last Name"
          placeholder="enter last name"
          :dense="dense"
        ></q-input>
        <q-input
          v-model="contact.title"
          label="Title"
          placeholder="enter title"
          :dense="dense"
        ></q-input>
        <q-input
          v-model="contact.email"
          label="Email"
          placeholder="enter email address"
          :dense="dense"
        ></q-input>

        <q-input
          v-model="contact.country"
          label="Country"
          placeholder="enter Country name"
          :dense="dense"
        ></q-input>
        <q-input
          v-model="contact.work_phone"
          label="Work Phone"
          placeholder="work phone"
          :dense="dense"
        ></q-input>
        <q-input
          v-model="contact.home_phone"
          label="Home Phone"
          placeholder="home phone"
          :dense="dense"
        ></q-input>
        <q-input
          v-model="contact.street_address"
          label="Address"
          placeholder="street address"
          :dense="dense"
        ></q-input>
        <q-input
          v-model="contact.city"
          label="City"
          placeholder="City"
          :dense="dense"
        ></q-input>
        <q-select
          v-model="contact.state"
          :options="getStateNames"
          label="State"
          placeholder="State"
          :dense="dense"
        />
        <q-input
          v-model="contact.postal_code"
          label="Postal Code"
          placeholder="postal code"
          :dense="dense"
        ></q-input>
      </div>
    </div>
  </div>
</template>
