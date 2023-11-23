<script setup lang="ts">
import { Ref, ref } from 'vue';
import { Login } from '../models/login';
import { useTokenStore } from '../stores/tokenStore';
import { Constants } from 'src/stores/Constants';
import { useVuelidate } from '@vuelidate/core';
import { email, required } from '@vuelidate/validators';
import { useQuasar } from 'quasar';

const tokenStore = useTokenStore();

const login: Ref<Login> = ref({
  userName: '',
  password: '',
});

const rules = {
  userName: { required, email },
  password: { required },
};

const v$ = useVuelidate(rules, login);
const $q = useQuasar();

async function onSubmit(e: any) {
  e.preventDefault(); // mandatory; we choose when we navigate
  // then we never call go()
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
    }
    //console.log(`errors: ${v$.value.$validate()}`);
    await tokenStore.validateLogin(login.value);
    const token = tokenStore.Token;
    // if (!token) return;
    //console.log(`token: ${token.token}`);
    // Now store the token in the local storage
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (token) {
      Constants.saveAuthorizationTokenInLocalStorage(
        token.token,
        token.expirationUnixEpoch
      );
    } else {
      // show what to do for error
    }
  } catch (error) {}
}
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
              ></q-input>
              <q-input
                dense
                outlined
                class="q-mt-md"
                v-model="login.password"
                type="password"
                label="Password"
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
