import { defineStore } from 'pinia';
import { Timesheet } from '../../models/Timesheet/timesheet';
import { TimesheetDetails } from '../../models/Timesheet/timesheetDetails';
import { Constants } from 'stores/Constants';
import util from 'src/helpers/util';
// import { linkHeader } from 'src/models/general/linkHeader';

export const useTimesheetsStore = defineStore('timesheetsStore', {
  state: () => ({
    timesheets: [] as Timesheet[],
    timesheet: undefined as Timesheet | undefined,

    timesheetDetails: [] as TimesheetDetails[],
    timesheetDetail: {} as TimesheetDetails,
    selectedTab: 'inbox' as string,
    pageSize: 10,
    nextPageUrl: null as string | null, // Stores the 'next' URL from the API
    errorMsg: '' as string,
  }),

  getters: {
    Timesheets: (state) => state.timesheets,
    Timesheet: (state) => state.timesheet,

    TimesheetDetails: (state) => state.timesheetDetails,
    TimesheetDetail: (state) => state.timesheetDetail,
    // IsEmptyLinkHeader: (state) => Object.keys(state.links).length == 0,
    SelectedTab: (state) => state.selectedTab,
  },

  actions: {
    /**
     * Resets the timesheet list and pagination.
     * Call this before loading data for a new category.
     */
    resetTimesheets() {
      this.timesheets = [];
      this.nextPageUrl = null;
      this.errorMsg = '';
    },
    /**
     * Fetches timesheets, appending them to the existing list for infinite scroll.
     * It uses the `nextPageUrl` if available, otherwise builds the initial URL.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if there are no more pages to load.
     */
    // constructBaseURL(category: string) {
    //   const baseUrl = `${util.getEndPointUrl()}/timesheet-summary?category=${category}&pagenumber=${
    //     this.pageNum
    //   }&pagesize=${this.pageSize}`;
    //   return baseUrl;
    // },

    // getUrl(category: string) {
    //   let callStr = '';
    //   if (!this.IsEmptyLinkHeader) {
    //     callStr = `${this.links}`;
    //   } else {
    //     callStr = this.constructBaseURL(category);
    //   }
    //   this.url = callStr;
    // },

    // resetPageNumber() {
    //   this.pageNum = 1;
    //   this.links = {} as linkHeader; // https://stackoverflow.com/a/45339463
    // },

    async fetchMoreTimesheets(category: string): Promise<boolean> {
      // Use the next page URL from the previous API call, or construct the initial URL.
      const requestUrl =
        this.nextPageUrl ||
        `${util.getEndPointUrl()}/timesheet-summary?category=${category}&pagesize=${this.pageSize}`;

      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(requestUrl);

        if (response.status === 200) {
          const summaries = response.data.data;
          this.timesheets.push(...summaries);
          const nextLink = response.data.pagination.next;
          // Store the next page URL from the API's pagination object. If it's null, we've reached the end.
          this.nextPageUrl = nextLink && nextLink !== 'null' ? nextLink : null;
          return this.nextPageUrl === null; // Return true if end is reached
        }

        if (response.status === 204) {
          if (this.timesheets.length === 0) {
            this.errorMsg = 'No Content';
          }
          return true; // No content, so we've reached the end.
        }

        return true; // For any other status, stop loading.
      } catch (error) {
        Constants.throwError(error);
        return true; // Stop loading on error.
      }
    },

    // getting all the timesheets for testing only, probably no where this use
    async getTimesheets() {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/timesheet-summary`,
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

    // need to review this function it seems no where it is used
    // getInOutboxList(status: string) {
    //   try {
    //     let completeUrl = '';
    //     switch (status) {
    //       case 'Inbox':
    //         completeUrl = `${util.getEndPointUrl()}/timesheet-summary?status=Saved&status=Approved&status=Submitted&status=Rejected`;
    //         break;
    //       case 'Outbox':
    //         completeUrl = `${util.getEndPointUrl()}/timesheet-summary?status=None&status=Pending`;
    //         break;
    //       case 'Archived':
    //         completeUrl = `${util.getEndPointUrl()}/timesheet-summary?status=Saved&status=Approved&status=Rejected`;
    //         break;
    //     }
    //     return completeUrl;
    //   } catch (error) {
    //     Constants.throwError(error);
    //   }
    // },
    // getting the timesheets by status
    // async getTimesheetsByStatus(status: string) {
    //   const callStr = `${util.getEndPointUrl()}/timesheet-summary?category=${status}`;
    //   try {
    //     const instance = Constants.getAxiosInstance();
    //     const response = await instance.get(callStr ?? '');
    //     this.timesheets = response.data.data;
    //     if (response.status === 204) {
    //       //this.errorMsg = response.statusText;
    //       this.errorMsg = 'No Content';
    //       return true;
    //     }
    //   } catch (error) {
    //     Constants.throwError(error);
    //   }
    // },

    async getTimesheetDetails(id: string | string[], stageId: number) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.get(
          `${util.getEndPointUrl()}/timesheet-detail?timesheetSid=${id}&stageId=${stageId}`,
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
          `${util.getEndPointUrl()}/timesheet-detail/${id}`,
        );
        this.timesheetDetail = response.data;
      } catch (error) {
        Constants.throwError(error);
      }
    },
    async editTimesheet(timesheetDetail: TimesheetDetails) {
      try {
        const instance = Constants.getAxiosInstance();
        const response = await instance.put(
          `${util.getEndPointUrl()}/timesheet-detail/${timesheetDetail.id}`,
          timesheetDetail,
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
          `${util.getEndPointUrl()}/timesheet-detail/${id}`,
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
          `${util.getEndPointUrl()}/timesheet-summary/${id}`,
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
          `${util.getEndPointUrl()}/timesheet-detail`,
          timesheetDetail,
        );
        if (response.status === 200) {
          this.timesheetDetail = response.data;
        }
      } catch (error) {
        Constants.throwError(error);
      }
    },
    async resetSummaryList() {
      this.issuesList = [];
    },
  },
});
