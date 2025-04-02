<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionStore } from 'stores/SessionStore';
import { useProfileListsStore } from 'stores/profileListsStore';
import { useQuasar } from 'quasar';

const router = useRouter();
const sessionStore = useSessionStore();
const profileListsStore = useProfileListsStore();
const props = defineProps(['dense']);
const $q = useQuasar();
const isDense = props.dense;
const updateOrganizations = async (newValue: any) => {
  $q.loading.show();
  try {
    await sessionStore.changeOrganization(newValue.id);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      await router.push({ path: '/homePage' });
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

const organizationItem = computed(() => {
  return organizationItems.value?.find(
    (orgItem) => orgItem.id === session.value.orgId
  );
});

const organization = ref(organizationItem.value?.name || '');
</script>

<template>
  <q-select
    class="full-width"
    :dense="isDense"
    v-model="organization"
    :options="organizationItems"
    label="Select Organization"
    option-label="name"
    option-value="id"
    outlined
    @update:model-value="updateOrganizations"
  />
</template>

<style scoped></style>
