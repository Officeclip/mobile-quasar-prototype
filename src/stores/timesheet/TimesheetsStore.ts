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
        const response = await axios.get(
          `${Constants.endPointUrl}/timesheetSummary`
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
          return `${Constants.endPointUrl}/timesheetSummary?status=Saved&&status=Approved&&status=Submitted&&status=Rejected`;
        case 'Outbox':
          return `${Constants.endPointUrl}/timesheetSummary?status=Pending`;
        case 'Archived':
          return `${Constants.endPointUrl}/timesheetSummary?status=Saved&&status=Approved&&status=Rejected`;
      }
    },
    // getting the timesheets by status
    async getTimesheetsByStatus(status: string) {
      const callStr = this.getInOutboxList(status);
      // status != ''
      //   ? `${Constants.endPointUrl}/timesheetSummary?status=${status}`
      //   : `${Constants.endPointUrl}/timesheetSummary`;
      // status == 'Saved'
      //   ? `${Constants.endPointUrl}/timesheetSummary?status=${status}&&status=Approved&&status=Submitted&&status=Rejected`
      //   : `${Constants.endPointUrl}/timesheetSummary`;
      // switch (status) {
      //   case 'Inbox':
      //     // const callStr = `${Constants.endPointUrl}/timesheetSummary?status=Saved&&status=Approved&&status=Submitted&&status=Rejected`;
      //     return `${Constants.endPointUrl}/timesheetSummary?status=Saved&&status=Approved&&status=Submitted&&status=Rejected`;
      //   case 'Outbox':
      //     return `${Constants.endPointUrl}/timesheetSummary?status=Pending`;
      //   case 'Archived':
      //     return `${Constants.endPointUrl}/timesheetSummary?status=Saved&&status=Approved&&status=Rejected`;
      // }
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
          `${Constants.endPointUrl}/timesheet-details?id=${id}`
        );
        this.timesheetDetails = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getSingleTimesheetDetail(id: string | string[]) {
      try {
        const response = await axios.get(
          `${Constants.endPointUrl}/timesheet-details?timesheetDetailSid=${id}`
        );
        this.timesheetDetail = response.data[0];
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
        const response = await axios.put(
          `${Constants.endPointUrl}/timesheet-details/${timesheetDetail.id}`,
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
          `${Constants.endPointUrl}/timesheet-details/${id}`
        );
        if (response.status === 200) {
          //debugger;
          this.timesheet = response.data;
        }
      } catch (error) {
        console.error(`deleteTimesheet Error: ${error}`);
      }
    },

    async addTimesheetDetails(timesheetDetail: TimesheetDetails) {
      const callStr = `${Constants.endPointUrl}/timesheet-details`;
      await fetch(callStr, {
        method: 'POST',
        body: JSON.stringify(timesheetDetail),
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(this.timesheetDetail);
    },
  },
});
