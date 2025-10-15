<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useSessionStore } from '../stores/SessionStore';
import { useRouter } from 'vue-router';
import packageJson from '../../package.json';
import { useProfileListsStore } from '../stores/profileListsStore';
import { Constants } from '../stores/Constants';
import util from 'src/helpers/util';
import SettingsComponent from './settingsPage.vue';
import { defineExpose } from 'vue';
import uploadphoto from 'src/components/general/UploadPhoto.vue';
import { useImageDetailStore } from 'src/stores/ImageDetail';
import { useQuasar } from 'quasar';

const sessionStore = useSessionStore();
const leftDrawerOpen = ref(false);
const router = useRouter();
const profileListsStore = useProfileListsStore();
const userPhoto = ref();

const $q = useQuasar();
const dark = ref($q.dark.isActive);

//save the updated image detail
const imageDetailStore = useImageDetailStore();

const session = computed(() => {
  return sessionStore.Session;
});

console.log('Session info: ', session.value);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

defineExpose({ toggleLeftDrawer });

const filteredHomeIcons = computed(() => {
  const homeIcons = sessionStore.getHomeIcons();
  const newIcons = [
    {
      id: 14,
      icon: 'home',
      name: 'Home Page',
      url: '/homePage',
      color: '',
    },
  ];
  const newHomeIcons = [newIcons[0], ...homeIcons];
  return newHomeIcons;
});

function getColor(url: string) {
  return url !== '' ? 'primary' : 'grey-6';
}

function getClass(url: string) {
  return url !== '' ? 'cursor-pointer' : 'cursor-not-allowed';
}

function goToApp(url: string) {
  if (url !== '') {
    router.push({ path: url });
  }
}

function logout() {
  router.push({ path: '/loginPage' });
  setTimeout(() => {
    window.location.reload();
  }, 400);
}

const loadProfileLists = async () => {
  if (util.isObjectNullOrEmpty(profileListsStore.ProfileLists)) {
    await profileListsStore.getProfileLists();
  }
  userPhoto.value = profileListsStore.ProfilesUserGeneral?.userPhoto;
};

onMounted(async () => {
  await loadProfileLists();
});

const settingsDialog = ref(false);
const position = ref<'top' | 'left' | 'right' | 'standard' | 'bottom'>('top');
const showViewPhoto = ref(false);
const showEditPhotoDialog = ref(false);

const openSettings = (pos: any) => {
  position.value = pos;
  settingsDialog.value = true;
};

// Handler for photo-updated event from uploadphoto component
function onPhotoUpdated(newPhoto: string) {
  showEditPhotoDialog.value = false;
  userPhoto.value = newPhoto;
  // Save the updated image detail
  imageDetailStore.constructImageObjectAndSave(
    session.value.userId,
    'Users',
    newPhoto,
  );
}

// Method to handle edit photo click
function handleEditPhotoClick() {
  setTimeout(() => {
    showEditPhotoDialog.value = true;
  }, 200);
}
</script>

<template>
  <q-drawer
    v-model="leftDrawerOpen"
    bordered
    show-if-above
    :breakpoint="1023"
    class="column"
  >
    <!-- Header Section with User Info -->
    <div class="bg-primary text-white q-pa-md">
      <q-item class="q-pa-none">
        <q-item-section side>
          <q-avatar
            size="56px"
            class="cursor-pointer bg-white text-primary shadow-2"
            @click="showViewPhoto = true"
          >
            <q-img v-if="userPhoto" :src="userPhoto" />
            <q-icon v-else name="person" size="32px" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-subtitle1 text-weight-medium">
            {{ session?.userName }}
          </q-item-label>
          <q-item-label class="text-caption">
            {{ session?.userEmail }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <div class="row justify-end">
        <q-btn
          icon="settings"
          flat
          round
          dense
          color="white"
          size="sm"
          @click="openSettings('left')"
        >
        </q-btn>
        <q-toggle
          color="orange"
          v-model="dark"
          :icon="dark ? 'light_mode' : 'dark_mode'"
          @update:model-value="$q.dark.set"
        />
      </div>
    </div>

    <!-- Navigation Section - Scrollable -->
    <q-scroll-area class="col">
      <q-list class="q-py-sm">
        <q-item
          v-for="item in filteredHomeIcons"
          :key="item.name"
          clickable
          v-ripple
          class="q-mx-sm q-my-xs rounded-borders"
          @click="goToApp(item.url)"
        >
          <q-item-section avatar>
            <q-icon
              :class="getClass(item.url)"
              :color="getColor(item.url)"
              :name="item.icon"
              size="md"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label
              class="text-weight-medium"
              :class="item.url === '' ? 'text-grey-6' : ''"
            >
              {{ item.name }}
            </q-item-label>
          </q-item-section>
          <q-item-section side v-if="item.url !== ''">
            <q-icon name="chevron_right" size="sm" />
          </q-item-section>
          <q-item-section side v-else>
            <q-chip size="sm" color="orange" text-color="white" label="Soon" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>

    <!-- Footer Section -->
    <q-separator />
    <div class="q-px-md q-mb-md">
      <!-- Version Information -->
      <q-item dense class="q-pa-sm rounded-borders q-mb-sm">
        <q-item-section>
          <div class="row justify-between items-center text-caption q-mb-xs">
            <span class="text-weight-medium">App Version:</span>
            <span class="text-weight-bold">{{ packageJson.version }}</span>
          </div>
          <div class="row justify-between items-center text-caption">
            <span class="text-weight-medium">OC Version:</span>
            <span class="text-weight-bold">{{
              Constants.getRestApiVersionFromSession()
            }}</span>
          </div>
        </q-item-section>
      </q-item>

      <!-- Logout Button -->
      <q-btn
        icon="logout"
        label="Log out"
        class="full-width"
        unelevated
        rounded
        color="negative"
        text-color="white"
        @click="logout"
      />
    </div>

    <!-- Photo View Dialog -->
    <q-dialog v-model="showViewPhoto">
      <q-card class="text-center q-pa-md" style="min-width: 300px">
        <q-card-section>
          <q-avatar size="140px">
            <q-img v-if="userPhoto" :src="userPhoto" />
            <q-icon v-else name="person" size="120px" color="grey-5" />
          </q-avatar>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6 text-weight-medium q-mb-xs">
            {{ session?.userName }}
          </div>
          <div class="text-caption text-grey-9">{{ session?.userEmail }}</div>
        </q-card-section>

        <q-card-actions align="center" class="q-pt-none">
          <q-btn
            flat
            color="primary"
            label="Edit Photo"
            @click="handleEditPhotoClick"
          />
          <q-btn flat color="grey" label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit Photo Dialog -->
    <q-dialog v-model="showEditPhotoDialog">
      <uploadphoto @photo-updated="onPhotoUpdated" />
    </q-dialog>

    <!-- Settings Dialog -->
    <q-dialog v-model="settingsDialog" :position="position">
      <SettingsComponent />
    </q-dialog>
  </q-drawer>
</template>

<style scoped>
/* Minimal custom styles - using mostly Quasar classes */
/* .disabled {
  opacity: 0.6;
  pointer-events: none;
} */

/* Hover effect for navigation items */
/* .q-item.q-item--clickable:not(.disabled):hover {
  background-color: #f5f5f5;
} */

/* Active state for current route */
/* .q-item.q-item--active {
  background-color: #e3f2fd;
  color: #1976d2;
} */
</style>
