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
    // getting all the timesheets for testing only, probably no where this use
    // TODO: Get all the list item at one time.
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
