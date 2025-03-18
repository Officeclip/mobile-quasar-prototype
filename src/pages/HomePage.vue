<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from 'stores/SessionStore';
import { useProfileListsStore } from 'stores/profileListsStore';
import { useQuasar } from 'quasar';
import drawer from '../components/drawer.vue';
import SelectOrganizations from 'src/components/general/SelectOrganizations.vue';

const router = useRouter();
const sessionStore = useSessionStore();
const profileListsStore = useProfileListsStore();

const $q = useQuasar();
const isLoaded = ref<boolean>(false);
const myDrawer = ref();

const filteredHomeIcons = computed(() => {
  return sessionStore.getHomeIcons();
});

const loadProfileList = async () => {
  $q.loading.show();
  try {
    // See: https://github.com/vuejs/pinia/discussions/1078#discussioncomment-4240994
    await sessionStore.getSession();
    await profileListsStore.getProfileLists();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/LoginPage' });
      router.go(0);
    });
  } finally {
    $q.loading.hide();
    isLoaded.value = true;
  }
};

onMounted(async () => {
  await loadProfileList();
});

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
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
</script>
<style>
.q-dialog__backdrop {
  backdrop-filter: blur(7px);
}
</style>
<template>
  <q-layout view="lHh Lpr lFf" v-if="isLoaded">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          aria-label="Menu"
          dense
          flat
          icon="menu"
          round
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> OfficeClip Suite</q-toolbar-title>
        <q-btn flat icon="logout" dense />
        <!-- <SelectOrganizations :dense="dense" class="bg-white" /> -->
      </q-toolbar>
    </q-header>

    <drawer ref="myDrawer" />

    <q-page-container>
      <q-page>
        <q-card class="q-mx-xl q-mt-md">
          <div>
            <SelectOrganizations /></div
        ></q-card>
        <div class="row">
          <div
            v-for="item in filteredHomeIcons"
            :key="item.name"
            class="col-4 flex justify-evenly q-mt-md"
          >
            <q-card
              class="flex flex-center text-center q-py-xs q-ma-md clickable-card"
              style="width: 100%; max-width: 250px"
              @click="goToApp(item.url)"
            >
              <div>
                <q-icon
                  :class="getClass(item.url)"
                  :color="getColor(item.url)"
                  :name="item.icon"
                  size="lg"
                ></q-icon>
                <div>{{ item.name }}</div>
              </div>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style scoped>
.clickable-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer; /* Change cursor to pointer */
}
.clickable-card:hover {
  transform: translateZ(10px) scale(1.05); /* Move forward and scale up */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  /* transform: translateZ(10px); Move card forward */
  /* transform: translateY(-4px); Slight lift on hover */
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); Add shadow for depth */
}

/* .clickable-card:active {
  transform: translateY(0); Return to original position on click
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); Reduce shadow on click
} */
.clickable-card:active {
  transform: translateZ(0) scale(1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.card-content {
  transition: font-size 0.2s ease, color 0.2s ease;
}
</style>
