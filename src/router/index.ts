import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { App as CapacitorApp } from '@capacitor/app';
import { Platform } from 'quasar';
import routes from './routes';
import { startIdleTimer, stopIdleTimer } from 'src/helpers/idleTimer';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Handle the back button event globally
  CapacitorApp.addListener('backButton', () => {
    if (Platform.is.android) {
      if (
        Router.currentRoute.value.path === '/loginPage' ||
        Router.currentRoute.value.path === '/'
      ) {
        CapacitorApp.exitApp();
      }
    }
  });

  const logout = () => {
    // Clear any authentication tokens or session data
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authSession');
    // Redirect to the login page
    Router.push('/loginPage');
    // Stop the idle timer when logging out
    stopIdleTimer();
  };

  // Start idle timer
  startIdleTimer(logout);

  let wasMinimized = false;

  // Detect app state change
  CapacitorApp.addListener('appStateChange', ({ isActive }) => {
    if (!isActive) {
      wasMinimized = true;
      stopIdleTimer();
    } else {
      if (wasMinimized) {
        startIdleTimer(logout);
      }
    }
    wasMinimized = false;
  });
  // Ensure the idle timer is restarted each time the user logs in
  Router.beforeEach((to, from, next) => {
    if (to.path !== '/loginPage') {
      startIdleTimer(logout);
    }
    next();
  });

  return Router;
});
