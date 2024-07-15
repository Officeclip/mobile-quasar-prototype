import { defineStore } from 'pinia';
import { eventDetails } from 'src/models/event/eventDetails';
import { MeetingAttendees } from 'src/models/meetingAttendees';
import { eventSummary } from 'src/models/event/eventSummary';
import { Constants } from 'stores/Constants';
import dateTimeHelper from 'src/helpers/dateTimeHelper';

export const useEventDetailsStore = defineStore('eventDetailsStore', {
  state: () => ({
    eventsCount: [] as eventDetails[],
    eventDetails: undefined as eventDetails | undefined, // for single event access
    eventSummary: undefined as eventSummary | undefined, // for single event access
    meetingAttendees: [] as MeetingAttendees[],
  }),

  getters: {
    EventDetails: (state) => state.eventDetails,
    EventSummary: (state) => state.eventSummary,
    MeetingAttendees: (state) => state.meetingAttendees,
    EventsCount: (state) => state.eventDetails,
  },

  actions: {
    // for getting meeting attendees from separate json
    async getAllMeetingAttendees() {
      const callStr = `${Constants.endPointUrl}/meetingAttendees`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.meetingAttendees = response.data;
      } catch (error) {
        // alert(error);
        Constants.throwError(error);
      }
    },

    //   ----getting single user details by id----
    async getEventDetailsById(id: string | string[]) {
      const callStr = `${Constants.endPointUrl}/event-detail/${id}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        if (response.data) {
          this.eventDetails = response.data;
        }
      } catch (error) {
        //alert(error);
        Constants.throwError(error);
      }
    },

    async getEventsByParent(parentObjectId: string) {
      const callStr = `${Constants.endPointUrl}/event-summary?parentSid=${parentObjectId}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);
        this.eventDetails = response.data;
        if (this.eventDetails) {
          this.eventDetails.startDateTime = this.eventDetails.isAllDayEvent
            ? dateTimeHelper.removeLastZ(this.eventDetails.startDateTime)
            : this.eventDetails.startDateTime;

          this.eventDetails.endDateTime = this.eventDetails.isAllDayEvent
            ? dateTimeHelper.removeLastZ(this.eventDetails.endDateTime)
            : this.eventDetails.endDateTime;
        }
        this.eventsCount = response.data.length;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async editEventDetails(event: eventDetails) {
      const callStr = `${Constants.endPointUrl}/event-detail/${event.id}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(callStr, event);
        if (response.status === 200) {
          this.eventDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async addEventDetails(event: eventDetails) {
      const callStr = `${Constants.endPointUrl}/event-detail`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(callStr, event);
        if (response.status === 200) {
          this.eventDetails = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async addEventSummary(eventSummary: eventSummary) {
      const callStr = `${Constants.endPointUrl}/event-summary`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(callStr, eventSummary);
        if (response.status === 200) {
          this.eventSummary = response.data;
        }
      } catch (error) {
        //console.error(`editEventSummary Error: ${error}`);
        Constants.throwError(error);
      }
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
        Constants.throwError(error);
      }
    },
  },
});
