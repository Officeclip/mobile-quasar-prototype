<script setup lang="ts">
import { defineProps, ref, onBeforeMount, Ref, watch } from 'vue';
import { useAccountListsStore } from '../../stores/account/accountListsStore';
import util from '../../helpers/util';
import { AccountDetails } from 'src/models/account/accountDetails';

// Define a common interface for select options
interface SelectOption {
  id: number;
  name: string;
  is_default?: boolean;
}

const props = defineProps<{ fromParentData: AccountDetails }>();
const accountDetails = ref(props.fromParentData);

watch(
  () => props.fromParentData,
  (newVal) => {
    accountDetails.value = newVal;
  },
);

// Use clearer, typed variable names
const stateOptions = ref<SelectOption[]>([]);
const countryOptions = ref<SelectOption[]>([]);

const filteredStateOptions = ref<SelectOption[]>([]);
const filteredCountryOptions = ref<SelectOption[]>([]);

const useaccountListsStore = useAccountListsStore();

onBeforeMount(async () => {
  await useaccountListsStore.getAccountLists();
  countryOptions.value = useaccountListsStore.Countries;
  stateOptions.value = useaccountListsStore.States;

  // Initialize filtered lists with all options
  filteredCountryOptions.value = countryOptions.value;
  filteredStateOptions.value = stateOptions.value;

  if (!accountDetails.value?.id) {
    setDefaultValues();
  }
});

function setDefaultValues() {
  const findDefaultOption = (options: SelectOption[]) => {
    const defaultObj = options.find((option) => option.is_default);
    return defaultObj ? defaultObj.id : null;
  };
  if (accountDetails.value) {
    accountDetails.value.state_id =
      findDefaultOption(stateOptions.value) || accountDetails.value.state_id;
    accountDetails.value.country_id =
      findDefaultOption(countryOptions.value) ||
      accountDetails.value.country_id;
  }
}

const accountNameRef = ref<any>(null);
const emailRef = ref<any>('');

const isAccountNameValid = () => {
  const condition =
    accountDetails.value.account_name &&
    accountDetails.value.account_name !== '';
  return condition ? true : 'Please enter an account name';
};

const isValidEmail = (val: string) => {
  if (!val) return true; // Allow empty email
  const condition = util.isValidEmail(val, false);
  return condition ? true : 'Please enter a valid email address';
};

const validateAll = () => {
  accountNameRef.value.validate();
  emailRef.value.validate();
  return !accountNameRef.value.hasError && !emailRef.value.hasError;
};

// Generic function to create a filter handler for q-select
const createFilterFn = (
  sourceOptions: Ref<SelectOption[]>,
  filteredOptions: Ref<SelectOption[]>,
) => {
  return (val: string, update: (callback: () => void) => void) => {
    update(() => {
      if (val === '') {
        filteredOptions.value = sourceOptions.value;
      } else {
        const needle = val.toLowerCase();
        filteredOptions.value = sourceOptions.value.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1,
        );
      }
    });
  };
};

// Create specific filter functions using the generic creator
const filterCountriesFn = createFilterFn(
  countryOptions,
  filteredCountryOptions,
);
const filterStatesFn = createFilterFn(stateOptions, filteredStateOptions);

defineExpose({
  validateAll,
});
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-input
        v-model="accountDetails.account_name"
        label="Account Name"
        placeholder="Enter account name"
        dense
        :rules="[isAccountNameValid]"
        hide-bottom-space
        ref="accountNameRef"
      />
      <q-input
        v-model.number="accountDetails.account_number"
        label="Account Number"
        placeholder="Enter account number"
        type="number"
        dense
      />
      <q-input
        v-model="accountDetails.email_address"
        label="Email"
        placeholder="Enter email address"
        dense
        :rules="[isValidEmail]"
        hide-bottom-space
        ref="emailRef"
      />
      <q-input
        v-model="accountDetails.main_phone"
        label="Main Phone"
        placeholder="Enter main phone"
        dense
      />
      <q-input
        v-model="accountDetails.street_address"
        label="Address"
        placeholder="Enter street address"
        dense
      />
      <q-input
        v-model="accountDetails.city"
        label="City"
        placeholder="Enter city"
        dense
      />
      <q-select
        v-model="accountDetails.state_id"
        :options="filteredStateOptions"
        label="State"
        dense
        option-value="id"
        option-label="name"
        map-options
        emit-value
        use-input
        fill-input
        hide-selected
        input-debounce="0"
        @filter="filterStatesFn"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">Not found</q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        v-model="accountDetails.postal_code"
        label="Postal Code"
        placeholder="Enter postal code"
        dense
      />
      <q-select
        v-model="accountDetails.country_id"
        :options="filteredCountryOptions"
        label="Country"
        dense
        option-value="id"
        option-label="name"
        map-options
        emit-value
        use-input
        fill-input
        hide-selected
        input-debounce="0"
        @filter="filterCountriesFn"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">Not found</q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        v-model="accountDetails.other_phone"
        label="Other Phone"
        placeholder="Enter other phone"
        dense
      />
      <q-input
        v-model="accountDetails.fax"
        label="Fax"
        placeholder="Enter fax"
        dense
      />
    </div>
  </div>
</template>
