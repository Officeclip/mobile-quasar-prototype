<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps(['params']);
const contactDetails = computed(() => props.params.contactDetails);
const stateName = computed(() => props.params.stateName);
const countryName = computed(() => props.params.countryName);
</script>
<template>
  <q-card-section class="q-pb-none">
    <q-list>
      <q-item class="q-mt-md">
        <q-item-section class="rowItems">
          <q-item-label caption>First Name</q-item-label>
          <q-item-label class="q-mb-sm">{{
            contactDetails?.first_name
          }}</q-item-label>
          <q-item-label caption>Title</q-item-label>
          <q-item-label class="q-mb-sm">{{
              contactDetails?.title
            }}</q-item-label>
          <q-item-label caption>Country</q-item-label>
          <q-item-label class="q-mb-sm">{{
              countryName
            }}</q-item-label>

          <q-item-label caption>Address</q-item-label>
          <q-item-label>{{ contactDetails?.street_address }}</q-item-label>
          <q-item-label>{{ contactDetails?.city }}, {{ stateName }}</q-item-label>
          <q-item-label>{{ countryName }},
            {{ contactDetails?.postal_code }}</q-item-label>
        </q-item-section>
        <q-item-section class="rowItems">
          <q-item-label caption>Last Name</q-item-label>
          <q-item-label class="q-mb-sm">{{
            contactDetails?.last_name
          }}</q-item-label>

          <q-item-label caption>Email</q-item-label>
          <q-item-label class="q-mb-sm">{{
              contactDetails?.email
            }}</q-item-label>

          <q-item-label caption>Work Phone</q-item-label>
          <q-item-label class="q-mb-sm">{{
              contactDetails?.work_phone
            }}</q-item-label>
          <q-item-label caption>Home Phone</q-item-label>
          <q-item-label class="q-mb-sm">{{
              contactDetails?.home_phone
            }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card-section>
</template>

<style scoped>
.rowItems {
  display: flex;
  align-content: center;
}

.justify-center {
  justify-content: flex-start;
}
</style>
