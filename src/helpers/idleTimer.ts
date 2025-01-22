import { ref } from 'vue';

const idleTime = ref(0);
let idleInterval: NodeJS.Timeout;

export function resetIdleTimer() {
  idleTime.value = 0;
}

export function startIdleTimer(logoutCallback: () => void, idleLimit = 60) {
  idleTime.value = 0; // Reset idle time when starting the timer
  clearInterval(idleInterval);
  idleInterval = setInterval(() => {
    idleTime.value++;
    if (idleTime.value >= idleLimit) {
      clearInterval(idleInterval);
      logoutCallback();
    }
  }, 1000);

  window.addEventListener('mousemove', resetIdleTimer);
  window.addEventListener('keypress', resetIdleTimer);
}

export function stopIdleTimer() {
  clearInterval(idleInterval);
  window.removeEventListener('mousemove', resetIdleTimer);
  window.removeEventListener('keypress', resetIdleTimer);
}
