<!-- eslint-disable vue/no-setup-props-destructure -->
<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { defineProps, ref, onMounted, computed, watch } from 'vue';
import dateTimeHelper from '../../helpers/dateTimeHelper';
import { useTimesheetListStore } from '../../stores/timesheet/TimesheetListStore';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const props = defineProps(['timesheet', 'periodName', 'timesheetDCAA']);
const $q = useQuasar();
const router = useRouter();
const customerProjectModel = ref('');

// const accountName = props.timesheet?.accountName;
// const projectName = props.timesheet?.projectName;
// const selectedCustomerProject = ref(
//   accountName ? `${accountName}:${projectName}` : ''
// );
// const serviceItemModel = ref('');

//to show the service item name initially when edit other wise we have to select the dropdown item
// serviceItemModel.value = props.timesheet ? props.timesheet.serviceItemName : '';
// const serviceItemsOptions = ref('');
// const customerProjectModel = ref('');
// const taskDate = ref('');
// taskDate.value = props.timesheet?.taskDate;

// format the taskDate and show for user interface like Nov 02(Fri)
// const formattedTaskDate =
//   taskDate.value != ''
//     ? ref(
//         `${new Date(taskDate.value).toLocaleString('en-US', {
//           month: 'short',
//           day: 'numeric',
//         })}(${new Date(taskDate.value).toLocaleString('en-US', {
//           weekday: 'short',
//         })})`
//       )
//     : ref('');

const timesheetListStore = useTimesheetListStore();

onMounted(async () => {
  try {
    await timesheetListStore.getTimesheetListAll();
  } catch (error) {
    $q.dialog({
      title: 'Alert',
      message: error,
    }).onOk(async () => {
      await router.push({ path: '/HomePage' });
    });
  }
  customerProjectModel.value =
    props.timesheet?.accountSid +
    (props.timesheet?.projectSid ? ':' + props.timesheet?.projectSid : '');
});

let errorMessage = '';
let isCommentsRequired = false;

// function calculateDaysBetween(date) {
//   if (!date) {
//     return 0; // Handle invalid date
//   }
//   const today = new Date();
//   const selectedDate = new Date(date);
//   // Ensure both dates are valid Date objects
//   if (!selectedDate.getTime() || !today.getTime()) {
//     return 0; // Handle invalid dates
//   }
//   // Get the difference in milliseconds
//   const timeDiff = selectedDate.getTime() - today.getTime();
//   // Calculate the number of days (rounded down to whole days)
//   const daysDiff = Math.floor(Math.abs(timeDiff) / (1000 * 60 * 60 * 24));
//   return daysDiff;
// }

const selectedPeriod = computed(() => {
  return timesheetListStore.PeriodList.find((x) => x.name === props.periodName);
});
const dateOptions = computed(() => {
  return dateTimeHelper.populateDates(
    selectedPeriod.value?.start,
    selectedPeriod.value?.end
  );
});

const customerProjectOptions = computed(() => {
  return timesheetListStore.CustomerProjectsList;
});

// const accountSid = props.timesheet?.accountSid;
// const projectSid = props.timesheet?.projectSid;
// const customerProjectId = ref(accountSid ? `${accountSid}:${projectSid}` : '');

//getting the service items list each time when click on service items dropdown
// function getServiceItems() {
//   if (customerProjectId.value) {
//     return (serviceItemsOptions.value =
//       timesheetListStore.getServiceItemsBycustomerProjectId(
//         customerProjectId.value
//       ));
//   }
//   return alert('Select the Customer:Project first');
// }

const billableOptions = ref([]);
billableOptions.value = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
];

// watch([taskDate], ([newTaskDate]) => {
//   formattedTaskDate.value = newTaskDate.name;
//   props.timesheet.taskDate = newTaskDate.startDate;

//   if (props.timesheetDCAA?.dcaa.isEnabled == true) {
//     const totalDays = calculateDaysBetween(props.timesheet.taskDate);
//     if (
//       totalDays > props.timesheetDCAA?.dcaa.relaxation &&
//       props.timesheet?.comments == ''
//     ) {
//       isCommentsRequired = true;
//       errorMessage = 'Comments must be added';
//     }
//   }
// });
// watch([serviceItemModel], ([newServiceItemModel]) => {
//   props.timesheet.serviceItemSid = newServiceItemModel.id;
// });

// const handleModelValue = (newValue) => {
//   customerProjectModel.value = newValue;
//   selectedCustomerProject.value = newValue;
//   customerProjectId.value = newValue.id;
//   // serviceItemModel.value = '';
//   props.timesheet.serviceItemName = '';

//   // Find the index of the colon
//   const colonIndex = newValue.name.indexOf(':');
//   if (colonIndex !== -1) {
//     // If colon exists, split the string into two parts
//     const firstPart = newValue.name.substring(0, colonIndex);
//     const secondPart = newValue.name.substring(colonIndex + 1);
//     props.timesheet.accountName = firstPart;
//     props.timesheet.projectName = secondPart;
//   } else {
//     // If colon doesn't exist, treat the entire string as a single part
//     props.timesheet.accountName = newValue.name;
//     props.timesheet.projectName = '';
//   }

//   // Find the index of the colon
//   const colonIndexOfId = newValue.id.indexOf(':');
//   if (colonIndexOfId !== -1) {
//     // If colon exists, split the string into two parts
//     const firstPart = newValue.id.substring(0, colonIndexOfId);
//     const secondPart = newValue.id.substring(colonIndexOfId + 1);
//     props.timesheet.accountSid = firstPart;
//     props.timesheet.projectSid = secondPart;
//   } else {
//     // If colon doesn't exist, treat the entire string as a single part
//     props.timesheet.accountSid = newValue.id;
//     props.timesheet.projectSid = '';
//   }
// };

// const setServiceItemvalues = (newValue) => {
//   props.timesheet.serviceItemName = newValue.name;
//   props.timesheet.serviceItemSid = newValue.id;
// };
watch([customerProjectModel], ([newCustomerProjectModel]) => {
  const customerProjectArray = newCustomerProjectModel.split(':');
  props.timesheet.accountSid = customerProjectArray[0];
  props.timesheet.projectSid =
    customerProjectArray.length > 1 ? customerProjectArray[1] : '';
});
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="q-ma-lg">
    <div class="q-ml-sm">
      <q-item-label caption>Period</q-item-label>
      <q-item-label v-if="selectedPeriod">{{
        selectedPeriod.name
      }}</q-item-label>
      <pre>{{ dateOptions }}</pre>
      <q-select
        label="Date"
        v-model="props.timesheet.taskDate"
        :options="dateOptions"
        option-label="name"
        option-value="startDate"
        emit-value
        map-options
      />
      <pre>{{ customerProjectOptions }}</pre>
      <pre>{{ props.timesheet }}</pre>
      <pre>{{ customerProjectModel }}</pre>
      <q-select
        label="Customer: Project"
        v-model="customerProjectModel"
        :options="customerProjectOptions"
        option-label="name"
        option-value="id"
        map-options
        emit-value
      />
      <!-- <pre>{{ props.timesheet.serviceItemName }}</pre> -->
      <!-- <q-select
        label="ServiceItems"
        v-model="props.timesheet.serviceItemName"
        @update:model-value="setServiceItemvalues"
        :options="serviceItemsOptions"
        option-label="name"
        option-value="id"
        map-options
        @click="getServiceItems()"
      /> -->

      <!-- <q-select
        label="Billable"
        v-model="props.timesheet.isBillable"
        :options="billableOptions"
        map-options
        emit-value
      /> -->
      <!-- <q-input
        label="Duration"
        v-model.number="props.timesheet.timeDuration"
        placeholder="enter here..."
        type="number"
      >
      </q-input> -->

      <!-- <q-input
        label="Description"
        v-model="props.timesheet.description"
        placeholder="enter here..."
      >
      </q-input> -->

      <!-- <q-input
        label="Comments"
        v-model="props.timesheet.comments"
        placeholder="enter here..."
        :label-color="isCommentsRequired ? 'red' : ''"
        :rules="[
          (val) =>
            (val && val.length > 0) || !isCommentsRequired || errorMessage,
        ]"
      >
      </q-input> -->
    </div>
  </div>
</template>
<style></style>
