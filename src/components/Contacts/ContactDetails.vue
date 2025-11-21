<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps(['params']);
const contactDetails = computed(() => props.params.contactDetails);
const contactDetailProperties = computed(() => {
  const details = contactDetails.value;
  if (!details) return [];
  return [
    {
      label: 'First Name',
      value: details.first_name,
      show: !!details.first_name,
    },
    {
      label: 'Last Name',
      value: details.last_name,
      show: !!details.last_name,
    },
    {
      label: 'Title',
      value: details.title,
      show: !!details.title,
    },
    {
      label: 'Email',
      value: details.email,
      show: !!details.email,
    },
    {
      label: 'Country',
      value: details.country_name,
      show: !!details.country_name,
    },
    {
      label: 'Work Phone',
      value: details.work_phone,
      show: !!details.work_phone,
    },
    {
      label: 'Home Phone',
      value: details.home_phone,
      show: !!details.home_phone,
    },

    {
      label: 'Address',
      value: details.street_address,
      show: !!details.street_address,
    },
  ];
});

const filterContactDetails = computed(() => {
  return contactDetailProperties.value.filter((prop) => prop.show);
});
</script>
<template>
  <q-card-section class="q-pb-none">
    <div class="row q-col-gutter-md">
      <div
        v-for="prop in filterContactDetails"
        :key="prop.label"
        class="col-xs-6 flex items-start"
      >
        <q-item v-if="prop.show">
          <q-item-section>
            <q-item-label caption>{{ prop.label }}: </q-item-label>
            <div v-if="prop.label === 'Address'">
              <q-item-label class="text-body1"> {{ prop.value }} </q-item-label>
              <q-item-label v-if="contactDetails?.city" class="text-body1">
                {{ contactDetails?.city }}, {{ contactDetails?.state_name }}
              </q-item-label>
              <q-item-label
                v-if="contactDetails?.country_name"
                class="text-body1"
              >
                {{ contactDetails?.country_name }},
                {{ contactDetails?.postal_code }}
              </q-item-label>
            </div>
            <div v-else>
              <q-item-label class="text-body1">{{ prop.value }}</q-item-label>
            </div>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-card-section>
</template>
