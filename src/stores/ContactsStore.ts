import { defineStore } from 'pinia';
import { Contact } from '../models/contact';
import { ContactDetail } from '../models/contactDetail';
import { State } from '../models/state';
import axios from 'axios';
import { Constants } from './Constants';
import { useMetaListStore } from './MetaListStore';

export const useContactsStore = defineStore('contactsStore', {
  state: () => ({
    contacts: [] as Contact[],
    states: [] as State[],
    contact: undefined as Contact | undefined, // we kept it separate because we will make a
    // separate call to get this
    contactDetail: undefined as ContactDetail | undefined,
  }),

  getters: {
    Contacts: (state) => state.contacts,
    States: (state) => state.states,
    Contact: (state) => state.contact,
    ContactDetails: (state) => state.contactDetail,
  },

  actions: {
    async getContacts() {
      try {
        const response = await axios.get(`${Constants.endPointUrl}/contacts`);
        this.contacts = response.data;
        //console.log(`ContactsStore: getContacts - ${this.contacts}`);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async getStates() {
      try {
        const response = await axios.get(`${Constants.endPointUrl}/states`);
        this.states = response.data;
        //console.log(`getStates: ${this.states}`)
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    //   ----getting single user details by id----
    async getContactSummary(id: number) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/contacts?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.contact = response.data[0];
        }
        console.log(
          `ContactsStore: getContacts - length - ${response.data.length}, ${this.contact}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    replaceIds(ids: string, values: any) {
      const idArray = ids.split(',');
      const names: string[] = [];
      for (let i = 0; i < idArray.length; i++) {
        const id = idArray[i];
        const listItem = values.find((item: any) => item.value === id);
        if (listItem) {
          names.push(listItem.name);
        }
      }
      return names.join(',');
    },

    async fixValuesForSelect(isReadOnly: boolean) {
      // the json returned has got the value for readonly, in order to show on the
      // screen we need to get the text from the value.
      const metaListStore = useMetaListStore();
      await metaListStore.getMetaLists();
      const metaLists = metaListStore.MetaLists;
      const contactDetail: any = this.contactDetail;

      for (const section of contactDetail.sections) {
        // Iterate through the section entries in the section
        for (const sectionEntry of section.sectionEntries) {
          // Find the matching list item in the meta list

          const listItem = metaLists.find(
            (item: any) => item.metaId === sectionEntry.metaId
          );

          // If found, replace the value from the list items
          if (listItem) {
            if (isReadOnly) {
              // This is for reading so we will replace the value with the text
              if (sectionEntry.type === 'select') {
                sectionEntry.value = listItem.listItems.find(
                  (item: any) => item.value == sectionEntry.value
                )?.name;
              } else {
                //TODO: Change this to switch statement for easy understanding
                // otherwise it is a multi-select
                sectionEntry.value = this.replaceIds(
                  sectionEntry.value,
                  listItem.listItems
                );
              }
            } else {
              // This is for edit so we will just add the options
              sectionEntry.options = listItem.listItems;
            }
          }
        }
      }
    },

    async getContactDetail(id: number, isReadOnly: boolean) {
      //debugger;
      console.log(`ContactsStore: getContactDetail: id: ${id}`);
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/contactDetails?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.contactDetail = response.data[0];
          //this.addOptionToContactDetail();
          this.fixValuesForSelect(isReadOnly);
        }
        console.log(
          `ContactsStore: getContactDetail - ${JSON.stringify(
            this.ContactDetails
          )}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async getContactsByBatch(limit: number, page: number) {
      // FIXME: put correct type
      const callStr = `${Constants.endPointUrl}/contacts?_limit=${limit}&_page=${page}`;
      //console.log(`callStr: ${callStr}`)
      const res = await fetch(callStr);
      const data = await res.json();
      //console.log(data);
      this.contacts.push(...data);
    },

    async getContactsWithFilter(limit: number, page: number, filter: string) {
      // FIXME: put correct type
      const callStr = `${Constants.endPointUrl}/contacts?_limit=${limit}&_page=${page}&first_name_like=${filter}`;
      console.log(`callStr: ${callStr}`);
      const res = await fetch(callStr);
      const data = await res.json();
      //console.log(data);
      this.contacts.push(...data);
    },

    async editContact(contact: Contact) {
      const res = await fetch(
        `${Constants.endPointUrl}/contacts/${contact.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contact),
        }
      );
      const data = await res.json();
    },

    async addContact(contact: Contact) {
      this.contacts.push(contact);

      const res = await fetch(`${Constants.endPointUrl}/contacts`, {
        //TODO: Change to axios api
        method: 'POST',
        body: JSON.stringify(contact),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(this.contacts);
      this.getContacts();
    },

    async deleteContact(id: any) {
      console.log('Deleted id:', id);
      alert('Want to delete this Contact');
      this.contacts = this.contacts.filter((t) => {
        return t.id === id;
      });

      const res = await fetch(`${Constants.endPointUrl}/contacts/` + id, {
        method: 'DELETE',
      });
    },
  },
});
