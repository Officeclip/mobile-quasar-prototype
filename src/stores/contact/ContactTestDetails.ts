import { defineStore } from 'pinia';
import { MetaDetails } from '../../models/Meta/metaDetails';

export const useMetaContactDetailsStore = defineStore(
  'metaContactDetailsStore',
  {
    state: () => ({
      contactDetails: [] as MetaDetails[],
    }),

    getters: {
      ContactDetails: (state) => state.contactDetails,
    },

    actions: {
      async getContactDetails() {
        const response = await fetch('data/mock_data.json');
        const mockData = await response.json();
        this.contactDetails = mockData['meta-details'].map((detail: any) => ({
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
  }
);
