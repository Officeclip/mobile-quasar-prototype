<script setup>
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();

const removeLocalData = () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to remove all local data?',
    cancel: true,
    // persistent: true,
  })
    .onOk(() => {
      console.log('>>>> OK');
      localStorage.clear();
      sessionStorage.clear();
      router.push({ path: '/' });
      setTimeout(() => {
        window.location.reload();
      }, 400); // 2000 milliseconds = 2 seconds
    })
    .onCancel(() => {
      console.log('>>>> Cancel');
      router.push({ path: '/HomePage' });
    });
};
</script>

<template>
  <div class="settings">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Settings</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-list>
          <q-item clickable v-ripple @click="removeLocalData">
            <q-item-section>
              <q-item-label>Reset data</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="refresh" />
            </q-item-section>
          </q-item>
          <!-- <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Profile</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="person" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Notifications</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="notifications" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Privacy</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="lock" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Theme</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="palette" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Language</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="language" />
            </q-item-section>
          </q-item> -->
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.settings {
  max-width: 400px;
  margin: auto;
}
</style>
