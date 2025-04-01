<script setup>
import { onMounted, ref, computed } from 'vue';
import { useMetaDetailsStore } from 'src/stores/MetaDetailsStore';
import { useRouter } from 'vue-router';
import EditMetaDetailCtrl from 'src/components/general/EditMetaDetailCtrl.vue';
import OCSaveButton from 'src/components/OCcomponents/OC-SaveButton.vue';

const router = useRouter();
const jsonData = ref(null);
const metaDetails = useMetaDetailsStore();

const loadDetails = async () => {
  try {
    await metaDetails.getMetaDetail_N();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error,
    }).onOk(() => {
      router.go(-1);
    });
  }
};

onMounted(async () => {
  await loadDetails();
  jsonData.value = items.value[0];
});

const items = computed(() => {
  return metaDetails.MetaDetails_N;
});

async function onSubmit() {
  try {
    const editMetaData = ref(jsonData);
    if (editMetaData.value) {
      console.log(
        'Update request of meta Data::editMetaData.value',
        editMetaData.value
      );
    }
    router.go(-1);
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error,
    });
  }
}
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>Edit Meta Data </q-toolbar-title>
        <OCSaveButton @handleClick="onSubmit"></OCSaveButton>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <div>
            <EditMetaDetailCtrl v-if="jsonData" :fromParentData="jsonData" />
          </div>
        </q-form>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
