import { defineStore } from 'pinia';
import { eventDetails } from 'src/models/event/eventDetails';
import { MeetingAttendees } from 'src/models/meetingAttendees';
import axios from 'axios';
import { eventSummary } from 'src/models/event/eventSummary';

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
      console.log('started the get function:', id);
      try {
        const response = await axios.get(
          `http://localhost:4000/event-details?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.eventDetails = response.data[0];
          console.log('get the event details by id:', this.eventDetails);
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
      console.log(`editEvent 1: ${event.id}`);
      // not added yet
      try {
        const response = await axios.put(
          `http://localhost:4000/event-details/${event.id}`,
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

    async addEventSummary(eventSummary: eventSummary) {
      const res = await fetch('http://localhost:4000/event-summary', {
        method: 'POST',
        body: JSON.stringify(eventSummary),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(this.eventSummary);
    },

    async deleteEventDetails(id: string | undefined) {
      try {
        const response = await axios.delete(
          `http://localhost:4000/event-details?id=${id}`
        );
        if (response.status === 200) {
          //debugger;
          this.eventDetails = response.data;
        }
      } catch (error) {
        console.error(`deleteEvent Error: ${error}`);
      }
    },

    // convert the local datetime into the utc format before saving into the json
    // convertLocalDateToUTC(dateTime: any) {
    //   return new Date(dateTime).toISOString();
    // },
  },
});
