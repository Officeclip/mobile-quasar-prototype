import { defineStore } from 'pinia';
import { label } from '../../models/event/eventLists';
import axios from 'axios';
import { Constants } from '../Constants';

export const useEventListsStore = defineStore('eventListsStore', {
  state: () => ({
    // timesheetList: undefined as TimesheetList | undefined,
    labels: [] as label[],
  }),

  getters: {
    Labels: (state) => state.labels,
  },

  actions: {
    async getEventLists() {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/event-lists`
        );
        const eventLists = response.data[0];
        this.labels = eventLists.labels;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
