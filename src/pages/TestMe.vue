<template>
  <div class="q-pa-md">
    <q-input v-model="url" label="Enter URL" type="text" />
    <q-btn label="Check URL" @click="checkUrl" color="primary" />
    <div v-if="showMessage" class="q-mt-sm">
      <q-alert v-if="isValid" type="positive" :value="true">
        Valid URL!
      </q-alert>
      <q-alert v-else type="negative" :value="true">
        Invalid URL. Please check the URL.
      </q-alert>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    const url = ref('');
    const urlRegex =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
    const isValid = computed(() => urlRegex.test(url.value));
    const showMessage = ref(false);

    const checkUrl = () => {
      showMessage.value = true;
    };

    return { url, isValid, checkUrl, showMessage };
  },
};
</script>
