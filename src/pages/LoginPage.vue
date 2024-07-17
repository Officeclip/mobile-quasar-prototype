<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import { Login } from '../models/login';
import { useSessionStore } from 'stores/SessionStore';
import { useTokenStore } from '../stores/tokenStore';
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { Constants } from 'src/stores/Constants';
import logger from 'src/helpers/logger';

const sessionStore = useSessionStore();
const tokenStore = useTokenStore();
const route1 = useRouter();

const login: Ref<Login> = ref({
  userName: Constants.defaultLogin,
  password: 'qa123',
});

const pin = ref('');

const rules = {
  userName: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, login);
const $q = useQuasar();

async function onSubmit(e: any) {
  e.preventDefault();
  try {
    const isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) {
      for (var key in v$.value.$errors) {
        const error = v$.value.$errors[key];
        $q.notify({
          message: `${error.$property}: ${error.$message}`,
          color: 'red',
        });
      }
      return;
    }
    await tokenStore.validateLogin(login.value, pin.value);
    await sessionStore.getSession();

    route1.push('/HomePage');
  } catch (error) {
    $q.notify({
      message: error as string,
      color: 'red',
    });
  }
}

onMounted(async () => {
  localStorage.removeItem('X-Token');
  sessionStorage.removeItem('oc-session');
  const uri = window.location.href.split('?');
  if (uri.length >= 2) {
    pin.value = uri[1];
  }
  //debugger;
  if (pin.value) {
    try {
      await tokenStore.validateLogin(login.value, pin.value);
      await sessionStore.getSession();
      route1.push('/HomePage');
    } catch (error) {
      $q.notify({
        message: error as string,
        color: 'red',
      });
    }
  }
  logger.log(`PIN is: ${pin.value}`, 'warn');
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-form @submit="onSubmit">
            <q-card-section class="text-center">
              <div class="text-grey-9 text-h5 text-weight-bold">Sign in</div>
              <div class="text-grey-8">
                Sign in below to access your account
              </div>
            </q-card-section>
            <q-card-section>
              <q-input
                dense
                outlined
                v-model="login.userName"
                label="Email Address"
                :rules="['email']"
                error-message="Please enter a valid email address"
              ></q-input>
              <q-input
                dense
                outlined
                class="q-mt-md"
                v-model="login.password"
                type="password"
                label="Password"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please enter password',
                ]"
              ></q-input>
            </q-card-section>
            <q-card-section>
              <q-btn
                style="border-radius: 8px"
                color="dark"
                rounded
                size="md"
                label="Sign in"
                no-caps
                class="full-width"
                type="submit"
              ></q-btn>
            </q-card-section>
            <q-card-section class="text-center q-pt-none">
              <div class="text-grey-8">
                Don't have an account yet?
                <a
                  href="#"
                  class="text-dark text-weight-bold"
                  style="text-decoration: none"
                  >Sign up.</a
                >
              </div>
              <div>
                <q-btn
                  :to="{
                    name: 'loginPage2',
                  }"
                  style="border-radius: 8px"
                  color="dark"
                  rounded
                  size="md"
                  label="Test page"
                  no-caps
                  class="full-width"
                  type="submit"
                ></q-btn>
              </div>
            </q-card-section>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style>
.my_card {
  width: 25rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}
</style>
