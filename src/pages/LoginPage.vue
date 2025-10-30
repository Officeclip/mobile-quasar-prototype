<script setup lang="ts">
import { Ref, ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { Login } from '../models/login';
import { useSessionStore } from '../stores/SessionStore';
import { useTokenStore } from '../stores/tokenStore';
import { useVuelidate } from '@vuelidate/core';
import { email, required, minLength } from '@vuelidate/validators';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { Constants } from '../stores/Constants';
import logger from 'src/helpers/logger';
import util from 'src/helpers/util';
import { useNotification } from '../composables/useNotification';
import welcomePage from 'src/pages/welcomPage.vue';
import { Browser } from '@capacitor/browser';

// Store and router initialization
const sessionStore = useSessionStore();
const tokenStore = useTokenStore();
const router = useRouter();
const $q = useQuasar();
const { showNotification } = useNotification();

// Reactive state
// const isLoading = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const addressBarUrl = window.location.href;

const login: Ref<Login> = ref({
  userName: Constants.getDefaultLogin(),
  password: '',
  mpin: '',
});

const mPin = ref<string | null>(null);

// Computed properties
const isFormValid = computed(() => !v$.value.$invalid);
const hasEndpointUrl = computed(() => !!util.getEndPointUrl());
const subtitleClass = computed(() =>
  $q.dark && $q.dark.isActive ? 'text-body2' : 'text-body2 text-grey-8',
);
const textColor = computed(() =>
  $q.dark && $q.dark.isActive ? 'text-white' : 'primary',
);

// Validation rules
const rules = {
  userName: {
    required,
    email,
    minLength: minLength(3),
  },
  password: {
    required,
  },
};

const v$ = useVuelidate(rules, login);

// Utility functions
function getMpin(): string | null {
  const uri = addressBarUrl.split('?');
  return uri.length >= 2 ? uri[1] : null;
}

function clearStorageData(): void {
  localStorage.removeItem('X-Token');
  sessionStorage.removeItem('oc-session');
}

// function showNotification(
//   message: string,
//   type: 'negative' | 'positive' = 'negative',
// ): void {
//   $q.notify({
//     message,
//     color: type === 'negative' ? 'negative' : 'positive',
//     position: 'top',
//     timeout: 3000,
//     // actions: [
//     //   { icon: 'close', color: 'white', round: true, handler: () => {} },
//     // ],
//   });
// }

function handleValidationErrors(): void {
  v$.value.$errors.forEach((error) => {
    showNotification(`${error.$property}: ${error.$message}`);
  });
}

// Main form submission handler
async function handleSubmit(e: Event): Promise<void> {
  e.preventDefault();

  $q.loading.show();

  try {
    const isFormCorrect = await v$.value.$validate();

    if (!isFormCorrect) {
      handleValidationErrors();
      return;
    }

    await tokenStore.validateLogin(login.value, mPin.value);

    function toggleRememberMe() {
      if (rememberMe.value) {
        Constants.saveUserNameInLocalStorage(login.value.userName);
      } else {
        localStorage.removeItem('userName');
      }
    }
    toggleRememberMe();

    showNotification('Login successful!', 'positive');
    await router.push('/HomePage');
  } catch (error) {
    showNotification((error as string) || 'Login failed. Please try again.');
  } finally {
    $q.loading.hide();
  }
}

// Auto-login with mPin
async function handleAutoLogin(): Promise<void> {
  if (!mPin.value) return;

  $q.loading.show();
  localStorage.removeItem('endPointUrl');
  util.setEndPointUrlInLocalStorageFromPageUri(addressBarUrl);

  try {
    await tokenStore.validateLogin(login.value, mPin.value);
    await sessionStore.getSession();
    await router.push('/HomePage');
  } catch (error) {
    showNotification((error as string) || 'Auto-login failed');
  } finally {
    $q.loading.hide();
  }
}

// Navigation handlers
// async function redirectToSetUpAccount(): Promise<void> {
//   await Browser.open({ url: 'https://app.officeclip.com/setupsite.aspx' });
// }

function togglePasswordVisibility(): void {
  showPassword.value = !showPassword.value;
}

// Lifecycle hooks
onMounted(async () => {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode) {
    $q.dark.set(JSON.parse(darkMode));
  }
  clearStorageData();

  login.value.userName = Constants.getDefaultLogin();

  if (login.value.userName) {
    rememberMe.value = true;
  } else {
    rememberMe.value = false;
  }
  mPin.value = getMpin();
  if (mPin.value) {
    logger.log(`PIN detected: ${mPin.value}`, 'info');
    await handleAutoLogin();
  }
});

onBeforeUnmount(() => {
  // isLoading.value = false;
  $q.loading.hide();
});
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="login-layout">
    <q-page-container>
      <q-page class="flex flex-center login-page">
        <!-- Background decorative elements -->
        <div class="background-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
        </div>

        <!-- API Link Page -->
        <div v-if="!hasEndpointUrl" class="api-link-container">
          <!-- <apiLinkPage /> -->
          <welcomePage />
        </div>

        <!-- Main Login Card -->
        <div v-else class="login-container">
          <q-card flat class="q-mx-sm">
            <!-- Header Section -->
            <q-card-section class="login-header">
              <q-avatar size="84px">
                <q-img src="/AppIcon.png" />
                <!-- <q-icon name="business" size="28px" /> -->
              </q-avatar>
              <h1 class="login-title">Welcome to OfficeClip</h1>
              <p :class="subtitleClass">
                Sign in to access your account and continue your journey
              </p>
            </q-card-section>

            <!-- Login Form -->
            <q-form
              v-if="!mPin"
              @submit="handleSubmit"
              class="login-form"
              greedy
            >
              <q-card-section>
                <!-- Email Input -->
                <div class="input-group">
                  <q-input
                    v-model="login.userName"
                    :error="v$.userName.$error"
                    label="Email Address"
                    type="email"
                    outlined
                    maxlength="450"
                    class="custom-input"
                    autocomplete="email"
                    @blur="v$.userName.$touch"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" color="grey-6" />
                    </template>
                  </q-input>
                </div>

                <!-- Password Input -->
                <div class="input-group">
                  <q-input
                    v-model="login.password"
                    :error="v$.password.$error"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    outlined
                    class="custom-input"
                    autocomplete="current-password"
                    @blur="v$.password.$touch"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" color="grey-6" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="showPassword ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        color="grey-6"
                        @click="togglePasswordVisibility"
                      />
                    </template>
                  </q-input>
                </div>

                <!-- Additional Options -->
                <div class="form-options">
                  <q-checkbox
                    v-model="rememberMe"
                    label="Remember me"
                    color="primary"
                  />
                  <q-btn
                    class="q-pa-none"
                    flat
                    no-caps
                    :color="textColor"
                    @click="
                      $q.notify('Forgot password functionality coming soon!')
                    "
                  >
                    Forgot Password?
                  </q-btn>
                </div>
              </q-card-section>

              <!-- Submit Button -->
              <q-card-section class="submit-section">
                <q-btn
                  type="submit"
                  :disable="!isFormValid"
                  color="primary"
                  size="lg"
                  class="login-btn"
                  no-caps
                  unelevated
                >
                  <!-- <span v-if="!isLoading">Sign In</span>
                  <span v-else>Signing In...</span> -->
                  <span>Sign In</span>
                </q-btn>
              </q-card-section>

              <!-- Footer Section -->
              <q-card-section>
                <!-- API URL Display -->
                <!-- as per Dutta suggestion not showing this section -->
                <!-- <div class="api-url-display">
                  <q-icon
                    name="link"
                    size="sm"
                    class="q-mr-xs"
                    color="grey-6"
                  />
                  <span class="text-caption text-grey-6">Connected to:</span>
                  <span class="text-caption text-weight-medium q-ml-xs">
                    {{ util.getEndPointUrl() }}
                  </span>
                </div> -->

                <!-- Sign Up Link -->
                <!-- <div class="signup-link">
                  <span class="text-body2 text-grey-7"
                    >Don't have an account?</span
                  >
                  <q-btn
                    flat
                    no-caps
                    color="primary"
                    class="signup-btn"
                    @click="redirectToSetUpAccount"
                  >
                    Create Account
                  </q-btn>
                </div> -->

                <!-- Test Page Button (Development) -->
                <div v-if="util.isHideTestPage()" class="test-page-section">
                  <q-separator class="q-my-md" />
                  <q-btn
                    :to="{ name: 'devTestPage' }"
                    color="grey-8"
                    size="md"
                    label="Development Test Page"
                    no-caps
                    outline
                    class="full-width"
                  />
                </div>
              </q-card-section>
            </q-form>

            <!-- Loading State for Auto-login -->
            <q-card-section v-if="mPin" class="text-center q-py-xl">
              <q-spinner-dots size="2rem" color="primary" />
              <p class="q-mt-md text-grey-6">Authenticating...</p>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
/* Layout Styles */
.login-layout {
  min-height: 100vh;
}

.login-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Background Decoration */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  right: -100px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: -75px;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  right: 10%;
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

/* Main Container */
.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem 0;
}

.api-link-container {
  position: relative;
  z-index: 1;
}

/* Card Styles */
/* .login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
} */

/* Header Section */
.login-header {
  text-align: center;
  /* padding: 2rem 2rem 1rem; */
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
}

/* .brand-logo {
  margin-bottom: 0.5rem;
} */

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
}

/* Form Styles */
.login-form {
  width: 100%;
}

/* .form-section {
  padding: 1.5rem 2rem;
} */

.input-group {
  margin-bottom: 1.5rem;
}

.custom-input {
  transition: all 0.3s ease;
}

/* .custom-input :deep(.q-field__control) {
  border-radius: 8px;
  min-height: 48px;
} */

.custom-input :deep(.q-field__control):hover {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.custom-input :deep(.q-field--focused .q-field__control) {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-top: 1rem; */
}

/* .remember-checkbox :deep(.q-checkbox__label) {
  font-size: 0.875rem;
  color: #4b5563;
} */

/* Submit Section */
.submit-section {
  padding: 0 2rem 1.5rem;
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

/* Footer Section */
/* .footer-section {
  padding: 1rem 2rem 2rem;
  background: rgba(248, 250, 252, 0.5);
  border-top: 1px solid rgba(226, 232, 240, 0.5);
} */

/* .api-url-display {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  border: 1px solid rgba(226, 232, 240, 0.5);
} */

.signup-link {
  text-align: center;
  margin-bottom: 1rem;
}

.signup-btn {
  margin-left: 0.25rem;
  font-weight: 600;
}

.test-page-section {
  margin-top: 1rem;
}

/* Responsive Design */
/* @media (max-width: 480px) {
  .login-container {
    padding: 0.5rem;
  }

  .login-header {
    padding: 1.5rem 1.5rem 1rem;
  }

  .form-section,
  .submit-section {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .footer-section {
    padding: 1rem 1.5rem 1.5rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
} */

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark theme support */
/* @media (prefers-color-scheme: dark) {
  .login-title {
    color: #f9fafb;
  }

  .login-subtitle {
    color: #9ca3af;
  }

  .footer-section {
    background: rgba(31, 41, 55, 0.5);
    border-color: rgba(75, 85, 99, 0.3);
  }

  .api-url-display {
    background: rgba(31, 41, 55, 0.7);
    border-color: rgba(75, 85, 99, 0.3);
  }
} */
</style>
