import { defineStore } from 'pinia';
import { eventDetails } from 'src/models/event/eventDetails';
import { MeetingAttendees } from 'src/models/meetingAttendees';
import axios from 'axios';
import { eventSummary } from 'src/models/event/eventSummary';
import { Constants } from 'stores/Constants';

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
        const response = await axios.get(callStr);

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
      const callStr = `${Constants.endPointUrl}/event-details?id=${id}`;
      try {
        const response = await axios.get(callStr);
        if (response.data && response.data.length > 0) {
          this.eventDetails = response.data[0];
        }
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async editEventDetails(event: eventDetails) {
      console.log(`editEvent 1: ${event.id}`);
      const callStr = `${Constants.endPointUrl}/event-details/${event.id}`;
      try {
        const response = await axios.put(callStr, event);
        if (response.status === 200) {
          //debugger;
          this.eventDetails = response.data;
        }
      } catch (error) {
        console.error(`editEvent Error: ${error}`);
      }
    },

    async addEventDetails(event: eventDetails) {
      const callStr = `${Constants.endPointUrl}/event-details`;
      const res = await fetch(callStr, {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(this.eventDetails);
    },

    async addEventSummary(eventSummary: eventSummary) {
      const callStr = `${Constants.endPointUrl}/event-summary`;
      const res = await fetch(callStr, {
        method: 'POST',
        body: JSON.stringify(eventSummary),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(this.eventSummary);
    },

    async deleteEventDetails(id: string | undefined) {
      const callStr = `${Constants.endPointUrl}/event-details/${id}`;
      try {
        const response = await axios.delete(callStr);
        if (response.status === 200) {
          this.eventDetails = response.data;
        }
      } catch (error) {
        console.error(`deleteEvent Error: ${error}`);
      }
    },
  },
});
