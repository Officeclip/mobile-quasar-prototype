import { defineStore } from 'pinia';
import { eventSummary } from '../../models/event/eventSummary.js';
import axios from 'axios';
import dateTimeHelper from 'src/helpers/dateTimeHelper.js';
import { Constants } from '../Constants';

export const useEventSummaryStore = defineStore('eventSummaryStore', {
  state: () => ({
    eventSummary: [] as eventSummary[],
  }),

  getters: {
    EventSummary: (state) => state.eventSummary,
  },

  actions: {
    // for getting meeting attendees from separate json
    async getAllEventSummary() {
      const callStr = `${Constants.endPointUrl}/event-summary`;
      try {
        const response = await axios.get(callStr);
        this.eventSummary = response.data;
        console.log(
          `EventsStore: getAllEventSummary - length - ${response.data.length}, ${this.eventSummary}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    getEventSummaryForADay(date: any) {
      const formattedDate = date.replace(/\//g, '-');
      //console.log(`getEventsForADay- date: ${formattedDate}`)
      if (this.eventSummary) {
        const eventsForADay = this.eventSummary.filter((t) => {
          return t.startDateTime.includes(formattedDate);
        });
        //console.log(`getEventsForADay: ${eventsForADay}`)
        return eventsForADay;
      } else {
        return [];
      }
    },

    async getEventSummaryByParent(
      parentObjectId: number,
      parentObjectServiceType: number
    ) {
      const callStr = `${Constants.endPointUrl}/eventSummary?parentSId=${parentObjectId}&parentServiceType=${parentObjectServiceType}`;

      try {
        const response = await axios.get(callStr);
        this.eventSummary = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    // Gets all the event dates so that we can color the simple calendar
    getEventSummaryDates() {
      if (this.eventSummary) {
        const dates = this.eventSummary.map(
          //https://stackoverflow.com/a/19590901
          function (a) {
            const helper = dateTimeHelper.extractDateFromUtc(a.startDateTime);
            return helper.replace(/-/g, '/');
          }
        );
        return dates;
      }
      return [];
    },
  },
});
