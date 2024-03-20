import { defineStore } from 'pinia';
import { eventDetails } from 'src/models/event/eventDetails';
import { MeetingAttendees } from 'src/models/meetingAttendees';
import axios from 'axios';
import { eventSummary } from 'src/models/event/eventSummary';
import { Constants } from 'stores/Constants';
import { security } from 'src/models/security';

export const useEventDetailsStore = defineStore('eventDetailsStore', {
  state: () => ({
    eventDetails: undefined as eventDetails | undefined, // for single event access
    eventSummary: undefined as eventSummary | undefined, // for single event access
    meetingAttendees: [] as MeetingAttendees[],
  }),

  getters: {
    EventDetails: (state) => state.eventDetails,
    EventSummary: (state) => state.eventSummary,
    MeetingAttendees: (state) => state.meetingAttendees,
  },

  actions: {
    // for getting meeting attendees from separate json
    async getAllMeetingAttendees() {
      const callStr = `${Constants.endPointUrl}/meetingAttendees`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);

        this.meetingAttendees = response.data;
        console.log(
          `EventsStore: getAllMeetingAttendees - length - ${response.data.length}, ${this.meetingAttendees}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    //   ----getting single user details by id----
    async getEventDetailsById(id: string | string[]) {
      console.log('started the get function:', id);
      const callStr = `${Constants.endPointUrl}/event-detail/${id}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        if (response.data) {
          this.eventDetails = response.data;
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async getEventsByParent(
      parentObjectId: number,
      parentObjectServiceType: number
    ) {
      const callStr = `${Constants.endPointUrl}/event-detail?parentSid=${parentObjectId}&parentServiceType=${parentObjectServiceType}`;
      console.log(callStr);
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.eventDetails = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async editEventDetails(event: eventDetails) {
      console.log(`editEvent 1: ${event.id}`);
      const callStr = `${Constants.endPointUrl}/event-detail/${event.id}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(callStr, event);
        if (response.status === 200) {
          this.eventDetails = response.data;
        }
      } catch (error) {
        console.error(`editEvent Error: ${error}`);
      }
    },

    async addEventDetails(event: eventDetails) {
      const callStr = `${Constants.endPointUrl}/event-detail`;
      await fetch(callStr, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(this.eventDetails);
    },

    async addEventSummary(eventSummary: eventSummary) {
      const callStr = `${Constants.endPointUrl}/event-summary`;
      await fetch(callStr, {
        method: 'POST',
        body: JSON.stringify(eventSummary),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(this.eventSummary);
    },

    async deleteEventDetails(id: string | undefined) {
      const callStr = `${Constants.endPointUrl}/event-detail/${id}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(callStr);
        if (response.status === 200) {
          this.eventDetails = response.data;
        }
      } catch (error) {
        console.error(`deleteEvent Error: ${error}`);
      }
    },
  },
});
