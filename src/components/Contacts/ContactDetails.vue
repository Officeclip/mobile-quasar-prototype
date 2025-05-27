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
          <q-item-label class="q-mb-sm">
            <span v-if="contactDetails?.first_name">{{
              contactDetails?.first_name
            }}</span>
            <span v-else style="opacity: 0.3; font-style: italic"
              >-- none --</span
            ></q-item-label
          >
          <q-item-label caption>Title</q-item-label>
          <q-item-label class="q-mb-sm">
            <span v-if="contactDetails?.title">{{
              contactDetails?.title
            }}</span>
            <span v-else style="opacity: 0.3; font-style: italic"
              >-- none --</span
            ></q-item-label
          >
          <q-item-label caption>Country</q-item-label>
          <q-item-label class="q-mb-sm">
            <span v-if="countryName">{{ countryName }}</span>
            <span v-else style="opacity: 0.3; font-style: italic"
              >-- none --</span
            ></q-item-label
          >

          <q-item-label v-if="contactDetails?.street_address" caption
            >Address</q-item-label
          >
          <q-item-label>
            <span v-if="contactDetails?.street_address">{{
              contactDetails?.street_address
            }}</span>
            <!-- <span v-else style="opacity: 0.3; font-style: italic"
              >-- none --</span
            > -->
          </q-item-label>
          <q-item-label v-if="contactDetails?.city">
            <span v-if="contactDetails?.city">{{ contactDetails?.city }}</span>
            , {{ stateName }}</q-item-label
          >
          <q-item-label
            ><span v-if="countryName">{{ countryName }},</span>
            <span v-if="contactDetails?.postal_code">{{
              contactDetails?.postal_code
            }}</span>
            <!-- <span v-else style="opacity: 0.3; font-style: italic"
              >-- none --</span
            > -->
          </q-item-label>
        </q-item-section>
        <q-item-section class="rowItems">
          <q-item-label caption>Last Name</q-item-label>
          <q-item-label class="q-mb-sm">
            <span v-if="contactDetails?.last_name">{{
              contactDetails?.last_name
            }}</span>
            <span v-else style="opacity: 0.3; font-style: italic"
              >-- none --</span
            ></q-item-label
          >

          <q-item-label caption>Email</q-item-label>
          <q-item-label class="q-mb-sm">
            <span v-if="contactDetails?.email">{{
              contactDetails?.email
            }}</span>
            <span v-else style="opacity: 0.3; font-style: italic"
              >-- none --</span
            ></q-item-label
          >

          <q-item-label caption>Work Phone</q-item-label>
          <q-item-label class="q-mb-sm">
            <span v-if="contactDetails?.work_phone">{{
              contactDetails?.work_phone
            }}</span>
            <span v-else style="opacity: 0.3; font-style: italic"
              >-- none --</span
            ></q-item-label
          >
          <q-item-label caption>Home Phone</q-item-label>
          <q-item-label class="q-mb-sm">
            <span v-if="contactDetails?.home_phone">{{
              contactDetails?.home_phone
            }}</span>
            <span v-else style="opacity: 0.3; font-style: italic"
              >-- none --</span
            ></q-item-label
          >
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
