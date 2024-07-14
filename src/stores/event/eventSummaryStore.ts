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

    // getNewEventSummary() {
    //   if (this.eventSummary) {
    //     // const convertedData = sampleData.map(event => {
    //     //   // Create a new object to avoid mutating the original data
    //     //   const newEvent = { ...event };

    //     //   // Parse the startDateTime string into a Date object
    //     //   newEvent.startDateTime = new Date(newEvent.startDateTime);

    //     //   return newEvent;
    //     // });

    //     const convertedSummaries = this.eventSummary.map((event) => {
    //       const newEvent = { ...event };
    //       if (newEvent.isAllDayEvent) {
    //         const helper = dateTimeHelper.extractDateFromUtc(
    //           newEvent.startDateTime
    //         );
    //         // return helper?.replace(/-/g, '/');
    //         if (helper !== undefined) {
    //           newEvent.startDate = new Date(helper);
    //         }
    //       } else {
    //         if (newEvent.startDateTime !== undefined) {
    //           const date = new Date(newEvent.startDateTime);
    //           newEvent.startDate = new Date(date);
    //         }
    //       }
    //       return newEvent;
    //     });
    //     // const newEventSummary = {... this.eventSummary};
    //     // //https://stackoverflow.com/a/19590901
    //     // function (a: eventSummary) {
    //     //   if (a.isAllDayEvent) {
    //     //     const helper = dateTimeHelper.extractDateFromUtc(a.startDateTime);
    //     //     // return helper?.replace(/-/g, '/');
    //     //     a.startDateTime = new Date(helper);
    //     //   } else {
    //     //     const date = new Date(a.startDateTime);
    //     //     // const year = date.getFullYear();
    //     //     // const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad month with leading zero
    //     //     // const day = String(date.getDate()).padStart(2, '0'); // Pad day with leading zero
    //     //     // return `${year}/${month}/${day}`;
    //     //     a.startDateTime = new Date(date);
    //     //   }
    //     //   }
    //     // );
    //     console.log('@@@@@@@@@@@@@@@@@@', convertedSummaries);
    //     return convertedSummaries;
    //   }
    // },

    getEventSummaryForADay(date: any) {
      //const formattedDate = date.replace(/\//g, '-');
      if (this.eventSummary) {
        const eventsForADay = this.eventSummary.filter((t) => {
          const newDate = dateTimeHelper.newExtractDateFromUtc(
            t.startDateTime,
            t.isAllDayEvent
          );
          return newDate === date;

          // return t.startDateTime?.includes(formattedDate);
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
      //this.getNewEventSummary();
      if (this.eventSummary) {
        const dates = this.eventSummary.map(
          //https://stackoverflow.com/a/19590901
          function (a) {
            const mydate = dateTimeHelper.newExtractDateFromUtc(
              a.startDateTime,
              a.isAllDayEvent
            );
            console.log(`$@$@$@$@: ${mydate}`);
            return mydate;
          }
        );
        return dates;
      }
      return [];
    },
  },
});
