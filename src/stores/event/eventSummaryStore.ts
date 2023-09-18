import { defineStore } from 'pinia';
import { eventSummary } from '../../models/event/eventSummary.js';
import axios from 'axios';
import dateTimeHelper from 'src/helpers/dateTimeHelper.js';

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
      try {
        const response = await axios.get('http://localhost:4000/event-summary');
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
      const callStr = `http://localhost:4000/eventSummary?parentSId=${parentObjectId}&parentServiceType=${parentObjectServiceType}`;

      try {
        const response = await axios.get(callStr);
        this.eventSummary = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    // Gets all the event dates so that we can color the simple calendar
    getEventSummaryDates() {
      // console.log(`getEventDates- events: ${this.events}`)
      if (this.eventSummary) {
        const dates = this.eventSummary.map(
          //https://stackoverflow.com/a/19590901
          function (a) {
            const helper = dateTimeHelper.extractDateFromUtc(a.startDateTime);
            return helper.replace(/-/g, '/');
          }
        );
        //console.log(`getEventDates: ${dates}`)
        return dates;
      }
      // console.log(`getEventDates: null`)
      return [];
    },
  },
});
