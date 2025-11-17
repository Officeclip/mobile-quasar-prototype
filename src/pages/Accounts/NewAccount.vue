<script setup lang="ts">
import { useAccountDetailsStore } from '../../stores/account/accountDetailsStore';
import { useRouter } from 'vue-router';
import accountsFormCtrl from '../../components/accounts/accountsFormCtrl.vue';
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

const $q = useQuasar();
const router = useRouter();
const useAccounts = useAccountDetailsStore();

const accountDetails = ref({
  id: '',
  account_name: '',
  account_number: '',
  email_address: '',
  main_phone: '',
  street_address: '',
  city: '',
  state_id: null,
  postal_code: '',
  country_id: null,
  other_phone: '',
  fax: '',
  security: {
    read: false,
    write: false,
    append: false,
    delete: false,
  },
});

const childComponent = ref<typeof accountsFormCtrl>();

async function onSubmit() {
  $q.loading.show();
  try {
    if (!childComponent.value?.validateAll()) return;

    await useAccounts.addAccount(accountDetails.value);
    router.push('/accountSummary');
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    });
  } finally {
    $q.loading.hide();
  }
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      title="New Account"
      :show-save-button="true"
      @save="onSubmit"
    ></OC_Header>
    <q-page-container>
      <q-form @submit="onSubmit" class="q-gutter-md">
        <div>
          <accountsFormCtrl
            v-if="accountDetails"
            :fromParentData="accountDetails"
            ref="childComponent"
          />
        </div>
      </q-form>
    </q-page-container>
  </q-layout>
</template>
