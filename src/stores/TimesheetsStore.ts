import { defineStore } from 'pinia';
import { Timesheet } from '../models/timesheet';
import { TimesheetDetails } from '../models/timesheetDetails';
import axios from 'axios';

export const useTimesheetsStore = defineStore('timesheetsStore', {
  state: () => ({
    timesheets: [] as Timesheet[],
    timesheet: undefined as Timesheet | undefined,

    timesheetDetails: [] as TimesheetDetails[],
    timesheetDetail: undefined as TimesheetDetails | undefined,
  }),

  getters: {
    Timesheets: (state) => state.timesheets,
    Timesheet: (state) => state.timesheet,

    TimesheetDetails: (state) => state.timesheetDetails,
    TimesheetDetail: (state) => state.timesheetDetail,
  },

  actions: {
    // getting all the timesheets for testing only, probably no where this use
    async getTimesheets() {
      try {
        const response = await axios.get(
          'http://localhost:4000/timesheetSummary'
        );
        this.timesheets = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    getTimesheetsCount(status: string) {
      this.getTimesheets();
      if (this.timesheets) {
        const newData = this.timesheets.filter((t) => {
          return t.status == status;
        });
        console.log('QQQQQQQQQQQQQQQQ', newData);
        return newData.length;
      } else {
        return [];
      }
    },
    // getting the timesheets by status
    async getTimesheetsByStatus(status: string) {
      const callStr =
        status != ''
          ? `http://localhost:4000/timesheetSummary?status=${status}`
          : 'http://localhost:4000/timesheetSummary';

      try {
        const response = await axios.get(callStr);
        this.timesheets = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async getTimesheetDetails(id: number) {
      try {
        const response = await axios.get(
          `http://localhost:4000/timesheet-details?id=${id}`
        );
        this.timesheetDetails = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async editTimesheet(timesheetDetail: TimesheetDetails) {
      console.log(`editTimesheet 1: ${this.timesheetDetail?.id}`);
      // not added yet
      try {
        const response = await axios.put(
          `http://localhost:4000/timesheet-details/${timesheetDetail.id}`,
          timesheetDetail
        );
        if (response.status === 200) {
          //debugger;
          this.timesheetDetail = response.data;
        }
      } catch (error) {
        console.error(`editTimesheet Error: ${error}`);
      }
    },
    async deleteTimesheet(id: number | undefined) {
      try {
        const response = await axios.delete(
          `http://localhost:4000/timesheet-details/${id}`
        );
        if (response.status === 200) {
          //debugger;
          this.timesheet = response.data;
        }
      } catch (error) {
        console.error(`deleteTimesheet Error: ${error}`);
      }
    },
  },
});
