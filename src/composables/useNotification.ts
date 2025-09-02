import { useQuasar } from 'quasar';

type NotificationType = 'negative' | 'positive' | 'info' | 'warning';

export function useNotification() {
  const $q = useQuasar();

  function showNotification(
    message: string,
    type: NotificationType = 'negative',
    position: 'top' | 'bottom' = 'top',
    onDismiss?: () => void,
  ) {
    $q.notify({
      message,
      color: type,
      position: position,
      timeout: 1500,
      actions: [
        { icon: 'close', color: 'white', round: true, handler: () => {} },
      ],
      onDismiss,
    });
  }

  return { showNotification };
}
