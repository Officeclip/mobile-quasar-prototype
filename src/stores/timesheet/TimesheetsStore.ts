import { defineStore } from 'pinia';
import { Timesheet } from '../../models/Timesheet/timesheet';
import { TimesheetDetails } from '../../models/Timesheet/timesheetDetails';
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
        Constants.throwError(error);
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
      try {
        let completeUrl = '';
        switch (status) {
          case 'Inbox':
            completeUrl = `${Constants.endPointUrl}/timesheet-summary?status=Saved&status=Approved&status=Submitted&status=Rejected`;
            break;
          case 'Outbox':
            completeUrl = `${Constants.endPointUrl}/timesheet-summary?status=None&status=Pending`;
            break;
          case 'Archived':
            completeUrl = `${Constants.endPointUrl}/timesheet-summary?status=Saved&status=Approved&status=Rejected`;
            break;
        }
        console.log(`getInOutboxList(): completeUrl - ${completeUrl}`);
        return completeUrl;
      } catch (error) {
        Constants.throwError(error);
      }
    },
    // getting the timesheets by status
    async getTimesheetsByStatus(status: string) {
      const callStr = `${Constants.endPointUrl}/timesheet-summary?category=${status}`;
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(callStr ?? '');
        this.timesheets = response.data.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },

    async getTimesheetDetails(id: string | string[], stageId: number) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${Constants.endPointUrl}/timesheet-detail?timesheetSid=${id}&stageId=${stageId}`
        );
        this.timesheetDetails = response.data;
      } catch (error) {
        Constants.throwError(error);
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
        Constants.throwError(error);
      }
    },
    async editTimesheet(timesheetDetail: TimesheetDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${Constants.endPointUrl}/timesheet-detail/${timesheetDetail.id}`,
          timesheetDetail
        );
        if (response.status === 200) {
          this.timesheetDetail = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
    async deleteTimesheet(id: string | string[]) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.delete(
          `${Constants.endPointUrl}/timesheet-detail/${id}`
        );
        if (response.status === 200) {
          this.timesheet = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
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
        Constants.throwError(error);
      }
    },

    async addTimesheetDetails(timesheetDetail: TimesheetDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.post(
          `${Constants.endPointUrl}/timesheet-detail`,
          timesheetDetail
        );
        if (response.status === 200) {
          this.timesheetDetail = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
  },
});
