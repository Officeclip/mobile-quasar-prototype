import { defineStore } from 'pinia';
import { eventSummary } from '../../models/event/eventSummary.js';
import dateTimeHelper from 'src/helpers/dateTimeHelper.js';
import { Constants } from '../Constants';
import util from 'src/helpers/util.js';

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
        ? `${util.getEndPointUrl()}/event-summary?year=${
            yearAndMonth.year
          }&month=${yearAndMonth.month}`
        : `${util.getEndPointUrl()}/event-summary`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        const events = response.data;

        this.eventSummary = events;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    getEventSummaryForADay(date: any) {
      if (this.eventSummary) {
        const eventsForADay = this.eventSummary.filter((t) => {
          if (t.startDateTime) {
            const newDate = dateTimeHelper.getDateTimeFromRestAPI(
              t.startDateTime,
              true
            );
            return dateTimeHelper.formatDateForCalendar(newDate) === date;
          }
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
      const callStr = `${util.getEndPointUrl()}/eventSummary?parentSId=${parentObjectId}&parentServiceType=${parentObjectServiceType}`;
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
            if (a.startDateTime) {
              const mydate = dateTimeHelper.getDateTimeFromRestAPI(
                a.startDateTime,
                true
              );
              const dateString = dateTimeHelper.formatDateForCalendar(mydate);
              return dateString;
            } else {
              return null;
            }
          }
        );
        return dates;
      }
      return [];
    },

    async resetEventSummaryList() {
      this.eventSummary = [];
    },
  },
});
