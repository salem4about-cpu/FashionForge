import { Workbox } from 'workbox-window';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        // Show update notification
        if (confirm('New version available! Reload to update?')) {
          wb.addEventListener('controlling', () => {
            window.location.reload();
          });
          wb.messageSkipWaiting();
        }
      } else {
        console.log('Service Worker installed for the first time');
      }
    });

    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        console.log('Service Worker activated');
      }
    });

    wb.register()
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });

    return wb;
  }
}

export function checkForUpdates(wb: Workbox | undefined) {
  if (wb) {
    wb.update();
  }
}
