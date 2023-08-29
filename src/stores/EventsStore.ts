import { defineStore } from 'pinia';
import dateTimeHelper from '../helpers/dateTimeHelper.js';
import { Event } from '../models/event';
import axios from 'axios';

export const useEventsStore = defineStore('eventsStore', {
  state: () => ({
    events: [] as Event[],
    event: undefined as Event | undefined, // for single event access
  }),

  getters: {
    Events: (state) => state.events,
    Event: (state) => state.event,
  },

  actions: {
    async getAllEvents() {
      try {
        const response = await axios.get('http://localhost:4000/events');
        this.events = response.data;
        console.log(
          `ContactsStore: getContacts - length - ${response.data.length}, ${this.events}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    async getEventsById(
      parentObjectId: number,
      parentObjectServiceType: number
    ) {
      const callStr = `http://localhost:4000/events?parentObjectId=${parentObjectId}&parentObjectServiceType=${parentObjectServiceType}`;

      try {
        const response = await axios.get(callStr);
        this.events = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    //   ----getting single user details by id----
    async getEventDetails(id: any) {
      try {
        const response = await axios.get(
          `http://localhost:4000/events?id=${id}`
        );
        if (response.data && response.data.length > 0) {
          this.event = response.data[0];
        }
        console.log(
          `ContactsStore: getContacts - length - ${response.data.length}, ${this.event}`
        );
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },

    getEventsForADay(date: any) {
      const formattedDate = date.replace(/\//g, '-');
      //console.log(`getEventsForADay- date: ${formattedDate}`)
      if (this.events) {
        const eventsForADay = this.events.filter((t) => {
          return t.startDateTime.includes(formattedDate);
        });
        //console.log(`getEventsForADay: ${eventsForADay}`)
        return eventsForADay;
      } else {
        return [];
      }
    },

    // Gets all the event dates so that we can color the simple calendar
    getEventDates() {
      // console.log(`getEventDates- events: ${this.events}`)
      if (this.events) {
        const dates = this.events.map(
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

    // async editEvent(event: any) {
    //   const res = await fetch(`http://localhost:4000/events/${event.id}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(event),
    //   });
    //   const data = await res.json();
    // },

    async editEvent(event: Event) {
      console.log(`editEvent 1: ${this.event?.id}`);
      // not added yet
      try {
        const response = await axios.put(
          `http://localhost:4000/events/${event.id}`,
          event
        );
        if (response.status === 200) {
          //debugger;
          this.event = response.data;
        }
      } catch (error) {
        console.error(`editEvent Error: ${error}`);
      }
    },

    async addEvent(event: any) {
      this.events.push(event);

      const res = await fetch('http://localhost:4000/events', {
        method: 'POST',
        body: JSON.stringify(event),
        headers: { 'Content-Type': 'application/json' },
      });

      // if (res.error) {
      //   console.log(res.error);
      // }
      console.log(this.events);
      //this.getEvents();
    },

    // async deleteEvent(id: any) {
    //   console.log('Deleted id:', id);
    //   alert('Want to delete this Event');
    //   this.events = this.events.filter((t) => {
    //     return t.id === id;
    //   });

    //   const res = await fetch('http://localhost:4000/events/' + id, {
    //     method: 'DELETE',
    //   });

    //   // if (res.error) {
    //   //   console.log(res.error);
    //   // }
    // },

    async deleteEvent(id: number | undefined) {
      try {
        const response = await axios.delete(
          `http://localhost:4000/events/${id}`
        );
        if (response.status === 200) {
          //debugger;
          this.event = response.data;
        }
      } catch (error) {
        console.error(`deleteEvent Error: ${error}`);
      }
    },
  },
});
