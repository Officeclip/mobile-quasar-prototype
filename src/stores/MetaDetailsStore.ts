import { defineStore } from 'pinia';
import { MetaDetails } from '../models/Meta/metaDetails';
import { Constants } from './Constants';
import { useMetaListsStore } from './MetaListsStore';
import util from 'src/helpers/util';

export const useMetaDetailsStore = defineStore('metaDetailsStore', {
  state: () => ({
    metaDetails: undefined as MetaDetails | undefined,
    metaDetails_N: [] as MetaDetails[],
  }),

  getters: {
    MetaDetails: (state) => state.metaDetails,
    MetaDetails_N: (state) => state.metaDetails_N,
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
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/meta-details?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.metaDetails = response.data[0];
          this.fixValuesForSelect(isReadOnly);
        }
      } catch (error: any) {
        alert(error);
      }
    },
    // March 01, 2025 implementing the meta details by Sudhakar need to review after done
    async getMetaDetail_N() {
      const response = await fetch('data/mock_data.json');
      const mockData = await response.json();
      this.metaDetails_N = mockData['meta-details'].map((detail: any) => ({
        ...detail,
        sections: detail.sections.map((section: any) => ({
          ...section,
          sectionEntries: section.sectionEntries.map((entry: any) => ({
            ...entry,
          })),
        })),
      }));
    },
  },
});
