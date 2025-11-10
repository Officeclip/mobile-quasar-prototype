<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAccountDetailsStore } from '../../stores/account/accountDetailsStore';
import { useRoute, useRouter } from 'vue-router';
// import NoteList from '../../components/Notes/NotesListCtrl.vue';
// import EventsList from '../../components/Events/EventsListCtrl.vue';
// import { ObjectType } from '../../helpers/util';
// import TaskMetaSummary from '../../components/tasks/TaskMetaSummaryItem.vue';
import { isAllowed } from 'src/helpers/security';
import { useQuasar } from 'quasar';
import ConfirmationDialog from '../../components/general/ConfirmDelete.vue';
import OC_Drawer from 'src/components/OC_Drawer.vue';
import OC_Loader from 'src/components/general/OC_Loader.vue';
import OC_Header from 'src/components/OCcomponents/OC_Header.vue';

const loading = ref(true);
const accountDetailsStore = useAccountDetailsStore();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const id = ref<string | string[]>('0');
id.value = route.params.id;

const myDrawer = ref();

const loadAccountDetails = async () => {
  loading.value = true;
  try {
    await accountDetailsStore.getAccountDetails(route.params.id as string);
    await accountDetailsStore.getAccountLists();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/accountSummary' });
      router.go(0);
    });
  } finally {
    loading.value = false;
  }
};

const accountDetails = computed(() => {
  return accountDetailsStore.AccountDetails;
});

const filterAccountDetails = computed(() => {
  const details = accountDetailsStore.AccountDetails;
  if (!details) return [];
  return [
    {
      label: 'Account Name',
      value: details.account_name,
      show: !!details.account_name,
    },
    {
      label: 'Account Number',
      value: details.account_number,
      show: !!details.account_number,
    },
    {
      label: 'Email Address',
      value: details.email_address,
      show: !!details.email_address,
    },
    {
      label: 'Country',
      value: details.country_name,
      show: !!details.country_name,
    },
    {
      label: 'Phone Number',
      value: details.main_phone,
      show: !!details.main_phone,
    },
    {
      label: 'Address',
      value: details.street_address,
      show: !!details.street_address,
    },
  ];
});

onMounted(async () => {
  await loadAccountDetails();
});

const isAllowEdit = computed(() => {
  const data = accountDetails.value?.security;
  return isAllowed({
    security: { write: data?.write },
  });
});

const isAllowDelete = computed(() => {
  const data = accountDetails.value?.security;
  return isAllowed({
    security: { delete: data?.delete },
  });
});

const title = ref('Confirm');
const message = ref('Are you sure you want to delete this Account?');
const showConfirmationDialog = ref(false);

const displayConfirmationDialog = () => {
  showConfirmationDialog.value = true;
};
const cancelConfirmation = () => {
  showConfirmationDialog.value = false;
};

const confirmDeletion = async () => {
  try {
    await accountDetailsStore.deleteAccountDetails(
      accountDetails.value?.id as string,
    );
    showConfirmationDialog.value = false;
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      showConfirmationDialog.value = false;
    });
  }
};

function toggleLeftDrawer() {
  if (myDrawer.value == null) return;
  myDrawer.value.toggleLeftDrawer();
}

const handleEditClick = () => {
  router.push({
    name: 'editAccountDetails',
    params: { id: id.value },
  });
};
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <OC_Header
      title="Account details"
      :show-menu-button="true"
      @toggle-drawer="toggleLeftDrawer"
      :show-edit-button="isAllowEdit"
      @edit="handleEditClick"
      :show-delete-button="isAllowDelete"
      @delete="displayConfirmationDialog"
    ></OC_Header>
    <OC_Drawer ref="myDrawer" />
    <q-page-container>
      <OC_Loader :visible="loading" />
      <q-card flat>
        <div class="q-pa-md">
          <div class="row q-col-gutter-md">
            <div
              v-for="(item, index) in filterAccountDetails"
              :key="index"
              class="col-12 col-sm-6 col-md-4"
            >
              <q-item v-if="item.show">
                <q-item-section>
                  <q-item-label caption>
                    {{ item.label }}
                  </q-item-label>
                  <div v-if="item.label === 'Address'">
                    <q-item-label class="text-body1">
                      {{ item.value || 'N/A' }}
                    </q-item-label>
                    <q-item-label v-if="accountDetails?.city">
                      {{ accountDetails?.city }},
                      {{ accountDetails?.state_name }}
                    </q-item-label>
                    <q-item-label v-if="accountDetails?.country_name">
                      {{ accountDetails?.country_name }},
                      {{ accountDetails?.postal_code }}
                    </q-item-label>
                  </div>
                  <div v-else>
                    <q-item-label class="text-body1">
                      {{ item.value || 'N/A' }}
                    </q-item-label>
                  </div>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </div>
      </q-card>
    </q-page-container>
  </q-layout>
  <ConfirmationDialog
    v-if="showConfirmationDialog"
    :showConfirmationDialog="showConfirmationDialog"
    :title="title"
    :message="message"
    @cancel="cancelConfirmation"
    @confirm="confirmDeletion"
  />
</template>
