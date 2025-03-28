<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  title: {
    type: String,
    required: true,
  },
  backButton: {
    type: Boolean,
    default: false,
  },
  // leftDrawerOpen: {
  //   type: Boolean,
  //   required: true,
  // },
  toggleLeftDrawer: {
    type: Function,
    required: true,
  },
  editButton: {
    type: Function,
    default: null, // Optional prop
  },
  deleteButton: {
    type: Function,
    default: null, // Optional prop
  },
  showLogOutButton: {
    type: Boolean,
    default: false, // Determines if the logout button should be shown
  },
});

// Logout functionality handled in the component itself
const logOut = () => {
  router.push({ path: '/loginPage' });
  setTimeout(() => {
    window.location.reload();
  }, 400); // Reload the page after navigating to the login page
};

const backButtonFunction = () => {
  router.go(-1);
};
</script>

<template>
  <q-toolbar>
    <!-- Back Button -->
    <q-btn
      flat
      round
      dense
      color="white"
      icon="arrow_back"
      @click="backButtonFunction()"
    />
    <!-- hamburger menu Button -->
    <q-btn
      flat
      round
      dense
      color="white"
      icon="menu"
      @click="toggleLeftDrawer"
    />

    <!-- Title -->
    <q-toolbar-title>{{ title }}</q-toolbar-title>

    <!-- Edit Button -->
    <q-btn
      v-if="editButton"
      flat
      round
      dense
      color="white"
      icon="edit"
      @click="editButton"
    />

    <!-- Delete Button -->
    <q-btn
      v-if="deleteButton"
      flat
      round
      dense
      color="white"
      icon="delete"
      @click="deleteButton"
    />

    <!-- Logout Button -->
    <q-btn
      v-if="showLogOutButton"
      flat
      round
      dense
      color="white"
      icon="logout"
      @click="logOut"
    />
  </q-toolbar>
</template>

<style scoped>
/* Add any styles for your toolbar here */
</style>
