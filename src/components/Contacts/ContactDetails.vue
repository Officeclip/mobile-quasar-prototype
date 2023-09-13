<script setup lang="ts">
console.log('Components/ContactDetails: Setup');
import { onMounted, computed } from 'vue';
import { useContactsStore } from '../../stores/ContactsStore';
import ContactDetailsViewItem from '../../components/Contacts/ContactDetailsViewItem.vue';

const contactsStore = useContactsStore();
const props = defineProps(['params']);

const contactId = computed(() => props.params.parentObjectId);

const contactDetails = computed(() => {
  return contactsStore.ContactDetails;
});
onMounted(() => {
  //contactsStore.$reset(); // FIXME: This is a safeguard and can be removed
  //debugger;
  contactsStore.getContactDetail(Number(contactId.value), true);
  console.log(`onMounted: Contacts - ${contactsStore.ContactDetails}`);
});
</script>

<template>
  <q-card
    v-for="(section, index) in contactDetails?.sections"
    :key="index"
    flat
    bordered
    class="relative-position card-example"
  >
    <q-card-section class="q-pb-none">
      <div class="text-h6">{{ section.sectionName }}</div>
    </q-card-section>
    <q-card-section class="q-pb-none">
      <q-list>
        <q-item>
          <q-item-section class="rowItems align-content-left">
            <!-- From: https://stackoverflow.com/a/62785796/89256 -->
            <div v-for="(sectionEntry, i) in section.sectionEntries" :key="i">
              <div v-if="!(i % 2)">
                <ContactDetailsViewItem :params="sectionEntry" />
              </div>
            </div>
          </q-item-section>
          <q-item-section class="rowItems align-content-right">
            <div v-for="(sectionEntry, i) in section.sectionEntries" :key="i">
              <div v-if="i % 2">
                <ContactDetailsViewItem :params="sectionEntry" />
              </div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
  <q-card>
    <div>
      <!-- <pre>{{ contactDetails }}</pre> -->
    </div>
  </q-card>
</template>
<style scoped>
.rowItems {
  display: flex;
}

.align-content-left {
  align-content: flex-start;
  margin-left: 12px;
}

.align-content-right {
  align-content: flex-end;
  margin-right: 12px;
}

.justify-center {
  justify-content: flex-start;
}
</style>
