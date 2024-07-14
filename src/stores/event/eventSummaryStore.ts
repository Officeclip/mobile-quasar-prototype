import { defineStore } from 'pinia';
import { eventSummary } from '../../models/event/eventSummary.js';
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
    async getAllEventSummary(yearAndMonth: any) {
      const callStr = yearAndMonth
        ? `${Constants.endPointUrl}/event-summary?year=${yearAndMonth.year}&month=${yearAndMonth.month}`
        : `${Constants.endPointUrl}/event-summary`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.eventSummary = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    getEventSummaryForADay(date: any) {
      const formattedDate = date.replace(/\//g, '-');
      if (this.eventSummary) {
        const eventsForADay = this.eventSummary.filter((t) => {
          const newDate = dateTimeHelper.extractDateFromUtc(
            t.startDateTime,
            t.isAllDayEvent
          );
          return newDate === formattedDate;
        });
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
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
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
            const mydate = dateTimeHelper.extractDateFromUtc(
              a.startDateTime,
              a.isAllDayEvent
            );
            return mydate?.replace(/-/g, '/');
          }
        );
        return dates;
      }
      return [];
    },
  },
});
