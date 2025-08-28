<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from '../../stores/SessionStore';
import { useProfileListsStore } from '../../stores/profileListsStore';
import { useQuasar } from 'quasar';

const router = useRouter();
const sessionStore = useSessionStore();
const profileListsStore = useProfileListsStore();
const $q = useQuasar();

const updateOrganizations = async (orgId: string) => {
  $q.loading.show();
  try {
    await sessionStore.changeOrganization(orgId);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
      router.go(0);
    });
  } finally {
    $q.loading.hide();
  }
};

const session = computed(() => {
  return sessionStore.Session;
});

const organizationItems = computed(() => {
  return profileListsStore.profileLists?.organization;
});

const organizationModel = computed(() => {
  return organizationItems.value?.find(
    (orgItem) => orgItem.id === session.value?.orgId,
  );
});
</script>

<template>
  <q-select
    class="full-width"
    filled
    transition-show="scale"
    transition-hide="scale"
    v-model="organizationModel"
    :options="organizationItems"
    label="Select Organization"
    option-label="name"
    option-value="id"
    emit-value
    outlined
    :loading="!organizationItems?.length"
    @update:model-value="updateOrganizations"
  />
</template>

<style scoped></style>
