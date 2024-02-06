<script setup lang="ts">
import { ref, computed, onBeforeMount, watch, capitalize } from 'vue';
import { useTimesheetsStore } from '../../stores/timesheet/TimesheetsStore';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { getExpenseOrTimesheetStatusColor } from 'src/helpers/colorIconHelper';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { isAllowed } from 'src/helpers/security';
// import { useSessionStore } from 'src/stores/SessionStore';

const timesheetStatus = ref('inbox');
const title = ref(capitalize(timesheetStatus.value));
const $q = useQuasar();
const router = useRouter();

const timesheetsStore = useTimesheetsStore();
// const sessionStore = useSessionStore();
// onMounted(() => {
//   timesheetsStore.getTimesheetsByStatus(String(timesheetStatus.value));
// });
onBeforeMount(async () => {
  try {
    await timesheetsStore.getTimesheetsByStatus(String(timesheetStatus.value));
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error as string,
    }).onOk(async () => {
      console.log('onBeforeMount OK button pressed');
      await router.push({ path: '/homePage' });
      router.go(0);
    });
    // $q.notify({
    //   message: error as string,
    //   color: 'red',
    // });
  }
});

const timesheetsAll = computed(() => {
  return timesheetsStore.Timesheets;
});

// const session = sessionStore.Session;
// const isAdmin = session.isAdmin;

// const isRoleAccess = () => {
//   const data = session.roleAccess.find(
//     (x) => x.name === 'TimeExpensesCreateTimeSheet'
//   );
//   return data?.access;
// };

const isAllow = isAllowed({ roleAccess: 'TimeExpensesCreateTimeSheet' });

watch([timesheetStatus], ([newModel]) => {
  timesheetsStore.getTimesheetsByStatus(String(newModel));
  title.value = capitalize(newModel);
});
</script>
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header reveal bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar class="glossy">
        <q-btn
          @click="$router.go(-1)"
          flat
          round
          dense
          color="white"
          icon="arrow_back"
        >
        </q-btn>
        <q-toolbar-title>{{ title }} Timesheets </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-footer elevated>
      <q-tabs
        v-model="timesheetStatus"
        class="bg-grey-9"
        dense
        align="justify"
        switch-indicator
      >
        <q-tab name="inbox" label="Inbox" icon="inbox" class="text-orange">
          <q-badge color="red" floating>2</q-badge>
        </q-tab>
        <q-tab name="outbox" label="Outbox" icon="outbox" class="text-cyan" />
        <q-tab
          name="archived"
          label="Archived"
          icon="archive"
          class="text-red"
        />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <q-page>
        <pre>{{ timesheetStatus }}</pre>
        <q-list v-for="item in timesheetsAll" :key="item.id">
          <q-item
            :to="{
              name: 'timesheetDetails',
              params: {
                id: item.id,
                fromDate: item.fromDate,
                readOnly: item.security.read,
              },
            }"
            clickable
            v-ripple
          >
            <q-item-section>
              <q-item-label>
                {{ item.createdByUserName }}
              </q-item-label>
              <q-item-label caption>
                {{
                  item.fromDate
                    ? dateTimeHelper.extractDateFromUtc(item.fromDate)
                    : 'No Specific Date'
                }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip
                dense
                :color="getExpenseOrTimesheetStatusColor(item.status)"
              >
                <q-item-label caption>{{ item.status }}</q-item-label>
              </q-chip>
            </q-item-section>
            <q-item-section side>
              <q-icon color="primary" name="chevron_right" />
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
        </q-list>
        <!-- <div>
          <pre>{{ session.isAdmin }}</pre>
          <pre>{{ isRoleAccess() }}</pre>
        </div> -->
        <div>
          <pre>{{ isAllow }}</pre>
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn
            v-if="isAllow"
            :to="{
              name: 'newTimesheetPeriod',
            }"
            fab
            icon="add"
            color="accent"
            padding="sm"
          >
          </q-btn>
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<style lang="scss">
@import '../../css/status.scss';
</style>
