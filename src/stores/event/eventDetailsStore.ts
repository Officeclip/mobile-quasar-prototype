import { defineStore } from 'pinia';
import { eventDetails } from '../../models/Event/eventDetails.js';
import { MeetingAttendees } from '../../models/meetingAttendees.js';
import axios from 'axios';

export const useEventDetailsStore = defineStore('eventDetailsStore', {
  state: () => ({
    eventDetails: undefined as eventDetails | undefined, // for single event access
    meetingAttendees: [] as MeetingAttendees[],
  }),

  getters: {
    EventDetails: (state) => state.eventDetails,
    MeetingAttendees: (state) => state.meetingAttendees,
  },

  actions: {
    // for getting meeting attendees from separate json
    async getAllMeetingAttendees() {
      try {
        const response = await axios.get(
          'http://localhost:4000/meetingAttendees'
        );

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
      try {
        const response = await axios.get(
          `http://localhost:4000/event-details?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.eventDetails = response.data[0];
        }
        console.log(
          `EventsStore: getEventsDetailsbyId - length - ${response.data.length}, ${this.eventDetails}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async editEventDetails(event: eventDetails) {
      console.log(`editEvent 1: ${this.eventDetails?.sid}`);
      // not added yet
      try {
        const response = await axios.put(
          `http://localhost:4000/event-details/${event.sid}`,
          event
        );
        if (response.status === 200) {
          //debugger;
          this.eventDetails = response.data;
        }
      } catch (error) {
        console.error(`editEvent Error: ${error}`);
      }
    },

    async addEventDetails(event: eventDetails) {
      const res = await fetch('http://localhost:4000/event-details', {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(this.eventDetails);
    },

    async deleteEventDetails(sid: string | undefined) {
      try {
        const response = await axios.delete(
          `http://localhost:4000/event-details/${sid}`
        );
        if (response.status === 200) {
          //debugger;
          this.eventDetails = response.data;
        }
      } catch (error) {
        console.error(`deleteEvent Error: ${error}`);
      }
    },
  },
});
