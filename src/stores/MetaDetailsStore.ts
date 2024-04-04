import { defineStore } from 'pinia';
import { MetaDetails } from '../models/Meta/metaDetails';
import axios from 'axios';
import { Constants } from './Constants';
import { useMetaListsStore } from './MetaListsStore';

export const useMetaDetailsStore = defineStore('metaDetailsStore', {
  state: () => ({
    metaDetails: undefined as MetaDetails | undefined,
  }),

  getters: {
    MetaDetails: (state) => state.metaDetails,
  },

  actions: {
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
      const metaListsStore = useMetaListsStore();
      await metaListsStore.getMetaLists();
      const metaLists = metaListsStore.MetaLists;
      const contactDetail: any = this.metaDetails;

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

    async getMetaDetail(id: number, isReadOnly: boolean) {
      //debugger;
      console.log(`ContactsStore: getContactDetail: id: ${id}`);
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/meta-details?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.metaDetails = response.data[0];
          //this.addOptionToContactDetail();
          this.fixValuesForSelect(isReadOnly);
        }
        console.log(
          `ContactsStore: getContactDetail - ${JSON.stringify(
            this.MetaDetails
          )}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
