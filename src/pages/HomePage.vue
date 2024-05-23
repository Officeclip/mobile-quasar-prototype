<!--
  FIXME: sg: icons should be bigger, row spacing should be more, screen doesn't dance on hover [30]
  FIXME: sg: organization drop down should work [30]
 -->

<script lang="ts" setup>
import { computed, ComputedRef, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from 'stores/SessionStore';
import { Session } from '../models/session';
import { useProfileListsStore } from 'stores/profileListsStore';
import { useQuasar } from 'quasar';

const router = useRouter();
const sessionStore = useSessionStore();
const profileListsStore = useProfileListsStore();

const organization = ref('');
const $q = useQuasar();

const filteredHomeIcons = computed(() => {
  return sessionStore.getHomeIcons();
});

async function updateOrganization(newValue: any) {
  await sessionStore.changeOrganization(newValue.id);
};

const session: ComputedRef<Session> = computed(() => {
  return sessionStore.session;
});

const userIcon = computed(() => {
  return profileListsStore.ProfilesUserGeneral.userIcon;
});

const organizationItems = computed(() => {
  return profileListsStore.Organizations;
});

onBeforeMount(async () => {
  try {
    // See: https://github.com/vuejs/pinia/discussions/1078#discussioncomment-4240994
    await sessionStore.getSession();
    await profileListsStore.getProfileLists();

    const organizationItems = computed(() => {
      return profileListsStore.profileLists.organization;
    });

    const organizationItem = computed(() => {
      return organizationItems.value.find((orgItem) => orgItem.id === session.value.orgId);
    });

    organization.value = organizationItem.value?.name as string;

  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('onBeforeMount OK button pressed');
      await router.push({ path: '/LoginPage' });
      router.go(0);
    });
  }
});

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

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
};
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn aria-label="Menu" dense flat icon="menu" round @click="toggleLeftDrawer" />
        <q-toolbar-title> OfficeClip Suite</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <!-- see: https://forum.quasar-framework.org/topic/2911/width-attribute-on-q-layout-drawer-giving-error-in-browser-console/3 -->
    <q-drawer v-model="leftDrawerOpen" :width="240" bordered class="bg-grey-2" show-if-above>
      <q-scroll-area style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        ">
        <q-list>
          <div v-for="item in filteredHomeIcons" :key="item.name">
            <q-item clickable @click="goToApp(item.url)">
              <q-item-section avatar>
                <q-icon :class="getClass(item.url)" :color="getColor(item.url)" :name="item.icon" size="md"></q-icon>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <q-btn color="primary" style="margin-top: 16px; margin-left: 16px" @click="logout">
            <q-icon left name="logout"></q-icon>
            <div>Logout</div>
          </q-btn>
        </q-list>
      </q-scroll-area>
      <q-img src="https://cdn.quasar.dev/img/material.png" class="absolute-top" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar class="q-mb-sm" size="56px">
            <img :src="userIcon" />
          </q-avatar>
          <div class="text-weight-bold">{{ session?.userName }}</div>
          <div>{{ session?.userEmail }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <q-page>
        <div class="q-pa-lg text-center">
          <q-select v-model="organization" :options="organizationItems" label="Select Organization" option-label="name"
            option-value="id" outlined @update:model-value="updateOrganization" />
        </div>
        <div>
          <div class="row">
            <div v-for="item in filteredHomeIcons" :key="item.name" class="col-4 q-pa-xl text-center itemsCenter"
              style="height: 150px">
              <div>
                <q-icon :class="getClass(item.url)" :color="getColor(item.url)" :name="item.icon" size="lg"
                  @click="goToApp(item.url)"></q-icon>
                <div>{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style scoped>
.pointer:hover {
  cursor: pointer;
  padding: 4px;
  border-radius: 50px;
  background-color: rgb(201, 201, 185);
  border: 1px solid rgb(24, 22, 22);
}

.itemsCenter {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
