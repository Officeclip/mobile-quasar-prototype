<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useSessionStore } from 'stores/SessionStore';
import { useRouter } from 'vue-router';
import packageJson from '../../package.json';
import { useProfileListsStore } from 'stores/profileListsStore';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util';
import SelectOrganizations from './general/SelectOrganizations.vue';
import SettingsComponent from './settingsPage.vue';
import { defineExpose } from 'vue';

const sessionStore = useSessionStore();
const leftDrawerOpen = ref(false);
const router = useRouter();
const profileListsStore = useProfileListsStore();
const userIcon = ref();
const dense = true;

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
    // {
    //   id: 34,
    //   icon: 'do_disturb',
    //   name: 'Reset',
    //   url: '/settings',
    //   color: '',
    // },
  ];
  const newHomeIcons = [newIcons[0], ...homeIcons];
  // newHomeIcons.push(newIcons[1]);
  return newHomeIcons;
});

function getColor(url: string) {
  return url !== '' ? 'primary' : 'dark';
}

function getClass(url: string) {
  return url !== '' ? 'pointer' : '';
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
  }, 400); // 2000 milliseconds = 2 seconds
}

const loadProfileLists = async () => {
  if (util.isObjectNullOrEmpty(profileListsStore.ProfileLists)) {
    await profileListsStore.getProfileLists();
  }
  userIcon.value = profileListsStore.ProfilesUserGeneral?.userIcon;
};

onMounted(async () => {
  await loadProfileLists();
});

const settingsDialog = ref(false);
const position = ref<'top' | 'left' | 'right' | 'standard' | 'bottom'>('top');
const openSettings = (pos: any) => {
  position.value = pos;
  settingsDialog.value = true;
};
</script>

<!-- see: https://forum.quasar-framework.org/topic/2911/width-attribute-on-q-layout-drawer-giving-error-in-browser-console/3 -->

<template>
  <q-drawer v-model="leftDrawerOpen" bordered show-if-above>
    <q-scroll-area style="margin-top: 80px; height: calc(100% - 80px)">
      <q-list>
        <!-- <q-item class="bg-grey-3">
          <q-item-section>
            <SelectOrganizations />
          </q-item-section>
        </q-item> -->
        <!-- <q-separator color="grey-4"></q-separator> -->
        <q-item
          v-for="item in filteredHomeIcons"
          :key="item.name"
          clickable
          @click="goToApp(item.url)"
        >
          <q-item-section avatar>
            <q-icon
              :class="getClass(item.url)"
              :color="getColor(item.url)"
              :name="item.icon"
              size="md"
            ></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
        </q-item>
        <!-- <q-item class="q-my-lg">
          <q-item-section>
            <div class="flex justify-between">
              <div>
                App Version:
                {{ packageJson.version }}
              </div>
              <div>
                OC Version:
                {{ Constants.getRestApiVersionFromSession() }}
              </div>
            </div>
          </q-item-section>
        </q-item> -->
      </q-list>
    </q-scroll-area>
    <div class="background-div">
      <q-item>
        <q-item-section side>
          <q-avatar size="xl" color="white">
            <!-- currently userIcon we couldn't able to get it from backend some code need to implement so that we are stopping to check this directly showing default -->
            <!-- <q-img v-if="userIcon" v-bind:src="userIcon" />
            <q-icon v-else name="person" /> -->
            <q-icon name="person" />
          </q-avatar>
        </q-item-section>
        <q-separator vertical color="white" inset></q-separator>
        <q-item-section class="q-ml-md text-white">
          <q-item-label class="text-subtitle1">
            {{ session?.userName }}
          </q-item-label>
          <q-item-label class="text-caption ellipsis">
            {{ session?.userEmail }}
          </q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-btn
            icon="settings"
            flat
            round
            dense
            color="white"
            @click="openSettings('left')"
          ></q-btn>
        </q-item-section>
      </q-item>
    </div>
    <q-dialog v-model="settingsDialog" persistent :position="position">
      <SettingsComponent />
    </q-dialog>
    <q-footer>
      <q-item dense class="bg-white text-black">
        <q-item-section>
          <div class="flex justify-between q-mb-sm">
            <div>
              App Version:
              {{ packageJson.version }}
            </div>
            <div>
              OC Version:
              {{ Constants.getRestApiVersionFromSession() }}
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-btn
        icon="logout"
        label="Log out"
        class="full-width q-pa-sm"
        unelevated
        rounded
        @click="logout"
      >
      </q-btn>
    </q-footer>
  </q-drawer>
</template>
<style scoped>
.background-div {
  background-color: #000; /* Replace with your desired color */
  height: 80px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}
</style>
