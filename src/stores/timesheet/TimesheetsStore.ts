import { defineStore } from 'pinia';
import { Timesheet } from '../../models/Timesheet/timesheet';
import { TimesheetDetails } from '../../models/Timesheet/timesheetDetails';
import axios from 'axios';
import { Constants } from 'stores/Constants';

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
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/timesheet-summary`
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
        return newData.length;
      } else {
        return [];
      }
    },

    getInOutboxList(status: string) {
      switch (status) {
        case 'Inbox':
          return `${Constants.endPointUrl}/timesheet-summary?status=Saved&status=Approved&status=Submitted&status=Rejected`;
        case 'Outbox':
          return `${Constants.endPointUrl}/timesheet-summary?status=None&status=Pending`;
        case 'Archived':
          return `${Constants.endPointUrl}/timesheet-summary?status=Saved&status=Approved&status=Rejected`;
      }
    },
    // getting the timesheets by status
    async getTimesheetsByStatus(status: string) {
      const callStr = `${Constants.endPointUrl}/timesheet-summary?category=${status}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr);

        if (response.data) {
          this.timesheets = response.data.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getTimesheetDetails(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/timesheet-detail?timesheetSid=${id}`
        );
        this.timesheetDetails = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getSingleTimesheetDetail(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/timesheet-detail/${id}`
        );
        this.timesheetDetail = response.data;
        console.log(
          'Testing the single timesheet details by Id',
          this.timesheetDetail
        );
      } catch (error) {
        console.error(error);
      }
    },
    async editTimesheet(timesheetDetail: TimesheetDetails) {
      console.log(`editTimesheet 1: ${this.timesheetDetail?.id}`);
      // not added yet
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${Constants.endPointUrl}/timesheet-detail/${timesheetDetail.id}`,
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
    async deleteTimesheet(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/timesheet-detail/${id}`
        );
        if (response.status === 200) {
          //debugger;
          this.timesheet = response.data;
        }
      } catch (error) {
        console.error(`deleteTimesheet Error: ${error}`);
      }
    },

    // to remove whole timesheet top level delete need to make it work
    async deleteAllTimesheets(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/timesheet-summary/${id}`
        );

        if (response.status === 200) {
          // Assuming the response contains the updated timesheet details
          this.timesheetDetails = response.data;
        }
      } catch (error) {
        console.error(`deleteTimesheet Error: ${error}`);
      }
    },

    async addTimesheetDetails(timesheetDetail: TimesheetDetails) {
      const callStr = `${Constants.endPointUrl}/timesheet-detail`;
      await fetch(callStr, {
        method: 'POST',
        body: JSON.stringify(timesheetDetail),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(this.timesheetDetail);
    },
  },
});
