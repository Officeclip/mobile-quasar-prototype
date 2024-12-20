import { defineStore } from 'pinia';
import dateTimeHelper from '../helpers/dateTimeHelper.js';
import { Event } from '../models/event';
import { MeetingAttendees } from '../models/meetingAttendees.js';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util.js';

export const useEventsStore = defineStore('eventsStore', {
  state: () => ({
    events: [] as Event[],
    event: undefined as Event | undefined, // for single event access
    meetingAttendees: [] as MeetingAttendees[],
  }),

  getters: {
    Events: (state) => state.events,
    Event: (state) => state.event,
    MeetingAttendees: (state) => state.meetingAttendees,
  },

  actions: {
    // for getting meeting attendees from separate json
    async getAllMeetingAttendees() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/meetingAttendees`
        );

        this.meetingAttendees = response.data;
      } catch (error: any) {
        alert(error);
      }
    },

    async getAllEvents() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(`${util.getEndPointUrl()}events`);
        this.events = response.data;
      } catch (error: any) {
        alert(error);
      }
    },

    async getEventsById(
      parentObjectId: number,
      parentObjectServiceType: number
    ) {
      const callStr = `${util.getEndPointUrl()}/events?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.events = response.data;
      } catch (error) {
        alert(error);
      }
    },

    //   ----getting single user details by id----
    async getEventDetails(id: any) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/events?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.event = response.data[0];
        }
      } catch (error: any) {
        alert(error);
        alert(error);
      }
    },

    getEventsForADay(date: any) {
      const formattedDate = date.replace(/\//g, '-');
      if (this.events) {
        const eventsForADay = this.events.filter((t) => {
          return t.startDateTime.includes(formattedDate);
        });
        return eventsForADay;
      } else {
        return [];
      }
    },

    // Gets all the event dates so that we can color the simple calendar
    getEventDates() {
      if (this.events) {
        const dates = this.events.map(
          //https://stackoverflow.com/a/19590901
          function (a) {
            const helper = dateTimeHelper.extractDateFromUtc(a.startDateTime);
            return helper?.replace(/-/g, '/');
          }
        );
        return dates;
      }
      return [];
    },

    async editEvent(event: Event) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${util.getEndPointUrl()}/events/${event.id}`,
          event
        );
        if (response.status === 200) {
          this.event = response.data;
        }
      } catch (error) {
        alert(error);
      }
    },

    async addEvent(event: any) {
      this.events.push(event);
      const res = await fetch(`${util.getEndPointUrl()}/events`, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' },
      });
    },

    async deleteEvent(id: number | undefined) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${util.getEndPointUrl()}/events/${id}`
        );
        if (response.status === 200) {
          this.event = response.data;
        }
      } catch (error) {
        alert(error);
      }
    },
  },
});
