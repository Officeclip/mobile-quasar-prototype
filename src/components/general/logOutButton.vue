<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const showDialog = ref(false);

const logOut = () => {
  showDialog.value = true;
};

const confirmLogOut = () => {
  showDialog.value = false;
  router.push({ path: '/' });
  setTimeout(() => {
    window.location.reload();
  }, 400); // 400 milliseconds
};

const cancelLogOut = () => {
  showDialog.value = false;
};
</script>

<template>
  <q-btn @click="logOut" flat round class="q-pa-sm">
    <div class="column items-center">
      <q-icon name="logout" />
      <!-- <span class="text-caption">Logout</span> -->
    </div>
  </q-btn>

  <q-dialog v-model="showDialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-icon name="warning" color="warning" size="2em" />
        <span class="q-ml-md">Confirm Logout</span>
      </q-card-section>

      <q-card-section> Are you sure you want to log out? </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="cancelLogOut" />
        <q-btn flat label="Logout" color="negative" @click="confirmLogOut" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
/* Add any styles for your button here */
</style>
