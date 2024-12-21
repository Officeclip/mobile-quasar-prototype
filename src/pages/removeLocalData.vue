<script setup>
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const router = useRouter();
function confirm() {
  $q.dialog({
    title: 'Confirm',
    message: 'Would you like to remove all local data?',
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      console.log('>>>> OK');
      localStorage.clear();
      sessionStorage.clear();
      router.push({ path: '/loginPage' });
    })
    .onCancel(() => {
      console.log('>>>> Cancel');
      router.push({ path: '/HomePage' });
    });
}
// alert('1234');
confirm();
router.push({ path: '/HomePage' });
</script>

<template>
  <p>Please wait</p>
</template>
