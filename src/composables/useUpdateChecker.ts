import { ref } from 'vue';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export function useUpdateChecker() {
  const updateAvailable = ref(false);
  const quasar = useQuasar();

  const checkUpdate = async () => {
    try {
      const response = await axios.get('/version.json');
      const latestVersion = response.data.version;
      const currentVersion = process.env.PACKAGE_VERSION; // This will be injected by Quasar

      if (latestVersion > currentVersion) {
        updateAvailable.value = true;
        quasar.dialog({
          title: 'Update Available',
          message:
            'A new version of the app is available. Please update to the latest version.',
          persistent: true,
          ok: {
            label: 'Update',
            color: 'primary',
            handler: async () => {
              if (Capacitor.isNativePlatform()) {
                await Browser.open({
                  url: 'https://play.google.com/store/apps/details?id=org.capacitor.quasar.officeclipsuite',
                });
              } else {
                window.open('https://your-app-store-link.com', '_blank');
              }
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  };

  return {
    updateAvailable,
    checkUpdate,
  };
}
